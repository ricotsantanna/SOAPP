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
    const plainApiKey = keyObj ? decryptApiKey(keyObj.encrypted_api_key) : '';

    // Build System Prompt + RAG Context
    const ragContext = await buildRAGContext(uid, message);
    const systemPrompt = constructSystemPrompt(instance?.system_prompt, ragContext);

    // Execution with user's BYOAI Key
    if (plainApiKey) {
      if (provider === 'openai') {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${plainApiKey.trim()}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
              ],
              temperature: 0.7,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'Sem resposta da OpenAI.';
            return NextResponse.json({ reply, provider: 'OpenAI (GPT-4o)', ragInjected: !!ragContext });
          } else {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData?.error?.message || `HTTP ${response.status}`;
            console.error('OpenAI BYOAI API Error:', errData);
            return NextResponse.json({
              reply: `⚠️ Erro no processamento da OpenAI: ${errMsg}. Por favor, verifique se a sua chave de API possui saldo ativo no painel da OpenAI e se foi digitada corretamente.`,
              provider: 'OpenAI (Erro de Autenticação/Cota)',
              ragInjected: !!ragContext
            });
          }
        } catch (err: any) {
          console.error('OpenAI Fetch Exception:', err);
          return NextResponse.json({
            reply: `⚠️ Falha ao conectar ao servidor da OpenAI: ${err?.message || 'Erro de rede'}`,
            provider: 'OpenAI (Erro de Conexão)'
          });
        }
      } else if (provider === 'gemini') {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${plainApiKey.trim()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nCliente: ${message}` }]
                }
              ]
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do Gemini.';
            return NextResponse.json({ reply, provider: 'Google Gemini 1.5 Flash (BYOAI)', ragInjected: !!ragContext });
          } else {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData?.error?.message || `HTTP ${response.status}`;
            console.error('Gemini BYOAI API Error:', errData);
            return NextResponse.json({
              reply: `⚠️ Erro no processamento do Google Gemini: ${errMsg}. Verifique a sua chave de API do Gemini em Configurações.`,
              provider: 'Google Gemini (Erro)'
            });
          }
        } catch (err: any) {
          console.error('Gemini Fetch Exception:', err);
          return NextResponse.json({
            reply: `⚠️ Falha ao conectar à API do Google Gemini: ${err?.message}`,
            provider: 'Gemini (Erro)'
          });
        }
      }
    }

    // Demo Mode Fallback Response when user hasn't added their API key yet
    let demoReply = `Olá! Sou o assistente com IA da **Social One**.\n\n`;
    if (ragContext) {
      demoReply += `📚 **[RAG Ativo]** Identifiquei dados relevantes na sua base de conhecimento!\n\n`;
    }
    demoReply += `Estou pronto para responder ao seu cliente. Nenhuma chave válida da **${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'}** foi detectada. Por favor, cadastre e selecione a sua chave no menu **Configurações (BYOAI)**.`;

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
