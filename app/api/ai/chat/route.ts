import { NextResponse } from 'next/server';
import { getAIKeys, getWhatsAppInstance, getOrCreateDemoUser } from '@/lib/db';
import { decryptApiKey } from '@/lib/encryption';
import { buildRAGContext, constructSystemPrompt } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId = 1, providerPreference } = body;

    if (!message) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    const user = await getOrCreateDemoUser();
    const uid = user.id || userId;

    // Fetch user AI Keys
    const userKeys = await getAIKeys(uid);
    const instance = await getWhatsAppInstance(uid);

    // Determine active provider
    let activeKeyObj = userKeys.find(k => k.encrypted_api_key);
    if (providerPreference) {
      activeKeyObj = userKeys.find(k => k.provider === providerPreference) || activeKeyObj;
    }

    const provider = activeKeyObj?.provider || providerPreference || 'openai';
    const plainApiKey = activeKeyObj ? decryptApiKey(activeKeyObj.encrypted_api_key) : '';

    // Build System Prompt + RAG Context
    const ragContext = await buildRAGContext(uid, message);
    const systemPrompt = constructSystemPrompt(instance?.system_prompt, ragContext);

    // Execution with user's BYOAI Key
    if (plainApiKey) {
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${plainApiKey}`,
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
          const reply = data.choices?.[0]?.message?.content || 'Sem resposta da IA.';
          return NextResponse.json({ reply, provider: 'OpenAI (BYOAI)', ragInjected: !!ragContext });
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error('OpenAI BYOAI Error:', errData);
        }
      } else if (provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${plainApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemPrompt}\n\nCliente: ${message}` }
                ]
              }
            ]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do Gemini.';
          return NextResponse.json({ reply, provider: 'Google Gemini (BYOAI)', ragInjected: !!ragContext });
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error('Gemini BYOAI Error:', errData);
        }
      }
    }

    // Demo Mode Fallback Response when user hasn't added their API key yet
    let demoReply = `Olá! Sou o assistente com IA da **Social One**.\n\n`;
    if (ragContext) {
      demoReply += `📚 **[RAG Ativo]** Identifiquei dados relevantes na sua base de conhecimento!\n\n`;
    }
    demoReply += `Estou pronto para responder ao seu cliente. Para ativar a inteligência real com zero custo para o SaaS, cadastre sua chave de API OpenAI ou Google Gemini no menu **Configurações (BYOAI)**.`;

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
