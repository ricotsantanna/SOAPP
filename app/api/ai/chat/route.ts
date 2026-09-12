import { NextResponse } from 'next/server';
import { getAIKeys, getWhatsAppInstance, getOrCreateDemoUser } from '@/lib/db';
import { decryptApiKey } from '@/lib/encryption';
import { buildRAGContext, constructSystemPrompt } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId = 1, providerPreference } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    const user = await getOrCreateDemoUser();
    const uid = user.id || userId;

    // Fetch user AI Keys & Instance Settings
    const userKeys = await getAIKeys(uid);
    const instance = await getWhatsAppInstance(uid);

    // Selected Active Provider
    const provider = providerPreference || instance?.active_provider || 'openai';

    // Find key for selected provider
    const keyObj = userKeys.find(k => k.provider === provider && k.encrypted_api_key);
    let plainApiKey = keyObj ? decryptApiKey(keyObj.encrypted_api_key) : '';

    // Ignore placeholder dummy keys
    if (plainApiKey.includes('xxxx') || plainApiKey.includes('••••')) {
      plainApiKey = '';
    }

    // Build System Prompt + RAG Context
    const ragContext = await buildRAGContext(uid, message);
    const systemPrompt = constructSystemPrompt(instance?.system_prompt, ragContext);

    // Execution with user's BYOAI Key
    if (plainApiKey) {
      if (provider === 'openai') {
        const modelsToTry = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o'];
        let openaiReply = '';
        let lastOpenaiErr = '';

        for (const model of modelsToTry) {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${plainApiKey.trim()}`,
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: message },
                ],
                temperature: 0.7,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              openaiReply = data.choices?.[0]?.message?.content || '';
              if (openaiReply) break;
            } else {
              const errData = await response.json().catch(() => ({}));
              lastOpenaiErr = errData?.error?.message || `HTTP ${response.status}`;
            }
          } catch (err: any) {
            lastOpenaiErr = err?.message || 'Erro de conexão com OpenAI';
          }
        }

        if (openaiReply) {
          return NextResponse.json({ reply: openaiReply, provider: 'OpenAI (GPT-4o)', ragInjected: !!ragContext });
        } else {
          return NextResponse.json({
            reply: `⚠️ Erro na OpenAI: ${lastOpenaiErr}. Por favor, verifique se a sua chave de API possui saldo ativo em platform.openai.com/account/billing e se foi digitada corretamente sem espaços.`,
            provider: 'OpenAI (Erro de Autenticação/Cota)',
            ragInjected: !!ragContext
          });
        }
      } else if (provider === 'gemini') {
        const geminiEndpoints = [
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${plainApiKey.trim()}`,
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${plainApiKey.trim()}`,
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${plainApiKey.trim()}`,
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${plainApiKey.trim()}`,
        ];

        let geminiReply = '';
        let geminiErrorMsg = '';

        for (const endpoint of geminiEndpoints) {
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nCliente: ${message}` }] }]
              }),
            });

            if (response.ok) {
              const data = await response.json();
              geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (geminiReply) break;
            } else {
              const errData = await response.json().catch(() => ({}));
              geminiErrorMsg = errData?.error?.message || `HTTP ${response.status}`;
            }
          } catch (err: any) {
            geminiErrorMsg = err?.message || 'Erro de conexão com Gemini';
          }
        }

        if (geminiReply) {
          return NextResponse.json({ reply: geminiReply, provider: 'Google Gemini (BYOAI)', ragInjected: !!ragContext });
        } else {
          return NextResponse.json({
            reply: `⚠️ Erro no Google Gemini: ${geminiErrorMsg}. Verifique se a sua chave de API do Gemini foi gerada no Google AI Studio (aistudio.google.com).`,
            provider: 'Google Gemini (Erro)'
          });
        }
      }
    }

    // Demo Mode Fallback Response when user hasn't added their API key yet
    let demoReply = `Olá! Sou o assistente com IA da **Social One**.\n\n`;
    if (ragContext) {
      demoReply += `📚 **[RAG Ativo]** Identifiquei dados relevantes na sua base de conhecimento!\n\n`;
    }
    demoReply += `Nenhuma chave válida da **${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'}** foi configurada. Por favor, cole sua chave no menu **Configurações (BYOAI)** para ativar as respostas automáticas de IA.`;

    return NextResponse.json({
      reply: demoReply,
      provider: 'Social One Demo Engine',
      ragInjected: !!ragContext,
      note: 'Cadastre sua chave em Configurações para habilitar a API da OpenAI/Gemini.'
    });

  } catch (error) {
    console.error('Error in AI Chat Route:', error);
    return NextResponse.json({ error: 'Falha no processamento da IA' }, { status: 500 });
  }
}
