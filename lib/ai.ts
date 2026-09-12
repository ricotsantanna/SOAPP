import { getAIKeys, getWhatsAppInstance, getOrCreateDemoUser } from '@/lib/db';
import { decryptApiKey } from '@/lib/encryption';
import { buildRAGContext, constructSystemPrompt } from '@/lib/rag';

export async function generateAIReply({
  message,
  userId = 1,
  providerPreference
}: {
  message: string;
  userId?: number;
  providerPreference?: string;
}): Promise<{ reply: string; provider: string; ragInjected: boolean }> {
  const user = await getOrCreateDemoUser();
  const uid = user.id || userId;

  // Fetch user AI Keys & Instance Settings
  const userKeys = await getAIKeys(uid);
  const instance = await getWhatsAppInstance(uid);

  // Selected Active Provider
  let provider = providerPreference || instance?.active_provider || 'openai';

  // Find key for selected provider
  const keyObj = userKeys.find(k => k.provider === provider && k.encrypted_api_key);
  let plainApiKey = keyObj ? decryptApiKey(keyObj.encrypted_api_key) : '';

  // Ignore placeholder dummy keys
  if (plainApiKey.includes('xxxx') || plainApiKey.includes('••••')) {
    plainApiKey = '';
  }

  // Smart Auto-Fallback: If requested provider key is empty, check if user has ANY valid key saved for another provider!
  if (!plainApiKey && provider !== 'custom') {
    const fallbackKey = userKeys.find(k => {
      if (!k.encrypted_api_key) return false;
      const dec = decryptApiKey(k.encrypted_api_key);
      return dec && !dec.includes('xxxx') && !dec.includes('••••') && dec.trim().length > 5;
    });

    if (fallbackKey) {
      provider = fallbackKey.provider;
      plainApiKey = decryptApiKey(fallbackKey.encrypted_api_key);
    }
  }

  // Build System Prompt + RAG Context
  const ragContext = await buildRAGContext(uid, message);
  const systemPrompt = constructSystemPrompt(instance?.system_prompt, ragContext);

  // Execution with user's BYOAI Key
  if (plainApiKey || provider === 'custom') {
    
    // 1. OPENAI
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
        return { reply: openaiReply, provider: 'OpenAI (GPT-4o)', ragInjected: !!ragContext };
      } else {
        return {
          reply: `⚠️ Erro na OpenAI: ${lastOpenaiErr}. Por favor, verifique se a sua chave de API possui saldo ativo em platform.openai.com.`,
          provider: 'OpenAI (Erro)',
          ragInjected: !!ragContext
        };
      }
    }

    // 2. GOOGLE GEMINI
    if (provider === 'gemini') {
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
        return { reply: geminiReply, provider: 'Google Gemini (BYOAI)', ragInjected: !!ragContext };
      } else {
        return {
          reply: `⚠️ Erro no Google Gemini: ${geminiErrorMsg}. Verifique a sua chave no Google AI Studio (aistudio.google.com).`,
          provider: 'Google Gemini (Erro)',
          ragInjected: !!ragContext
        };
      }
    }

    // 3. ANTHROPIC CLAUDE
    if (provider === 'claude') {
      const claudeModels = ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'];
      let claudeReply = '';
      let claudeErr = '';

      for (const model of claudeModels) {
        try {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': plainApiKey.trim(),
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model,
              max_tokens: 1024,
              system: systemPrompt,
              messages: [{ role: 'user', content: message }]
            })
          });

          if (response.ok) {
            const data = await response.json();
            claudeReply = data.content?.[0]?.text || '';
            if (claudeReply) break;
          } else {
            const errData = await response.json().catch(() => ({}));
            claudeErr = errData?.error?.message || `HTTP ${response.status}`;
          }
        } catch (err: any) {
          claudeErr = err?.message || 'Erro de conexão com Claude';
        }
      }

      if (claudeReply) {
        return { reply: claudeReply, provider: 'Anthropic Claude (BYOAI)', ragInjected: !!ragContext };
      } else {
        return {
          reply: `⚠️ Erro na Anthropic (Claude): ${claudeErr}. Verifique sua chave no console da Anthropic (console.anthropic.com).`,
          provider: 'Claude (Erro)',
          ragInjected: !!ragContext
        };
      }
    }

    // 4. NVIDIA NIM (Llama 3 / DeepSeek / Mistral)
    if (provider === 'nvidia') {
      const nvidiaModels = ['meta/llama-3.3-70b-instruct', 'meta/llama-3.1-70b-instruct', 'deepseek-ai/deepseek-r1'];
      let nvidiaReply = '';
      let nvidiaErr = '';

      for (const model of nvidiaModels) {
        try {
          const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${plainApiKey.trim()}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              temperature: 0.6,
            })
          });

          if (response.ok) {
            const data = await response.json();
            nvidiaReply = data.choices?.[0]?.message?.content || '';
            if (nvidiaReply) break;
          } else {
            const errData = await response.json().catch(() => ({}));
            nvidiaErr = errData?.detail || errData?.message || `HTTP ${response.status}`;
          }
        } catch (err: any) {
          nvidiaErr = err?.message || 'Erro de conexão com NVIDIA NIM';
        }
      }

      if (nvidiaReply) {
        return { reply: nvidiaReply, provider: 'NVIDIA NIM (Llama/DeepSeek)', ragInjected: !!ragContext };
      } else {
        return {
          reply: `⚠️ Erro na NVIDIA NIM API: ${nvidiaErr}. Verifique sua chave de API obtida no portal build.nvidia.com.`,
          provider: 'NVIDIA NIM (Erro)',
          ragInjected: !!ragContext
        };
      }
    }

    // 5. PROVEDOR CUSTOMIZADO / GROQ / DEEPSEEK / OLLAMA / LOCAL VPS
    if (provider === 'custom') {
      const baseUrl = (instance?.custom_base_url || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
      const modelName = instance?.custom_model_name || 'llama-3.1-8b-instant';
      const url = `${baseUrl}/chat/completions`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(plainApiKey ? { 'Authorization': `Bearer ${plainApiKey.trim()}` } : {})
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || 'Sem resposta do provedor customizado.';
          return { reply, provider: `Custom Provider (${modelName})`, ragInjected: !!ragContext };
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `HTTP ${response.status}`;
          return {
            reply: `⚠️ Erro no Provedor Customizado em ${baseUrl}: ${errMsg}`,
            provider: 'Custom Provider (Erro)',
            ragInjected: !!ragContext
          };
        }
      } catch (err: any) {
        return {
          reply: `⚠️ Falha ao conectar ao servidor do Provedor Customizado (${baseUrl}): ${err?.message}`,
          provider: 'Custom Provider (Erro)',
          ragInjected: !!ragContext
        };
      }
    }
  }

  // Demo Mode Fallback Response when user hasn't added their API key yet
  let demoReply = `Olá! Sou o assistente com IA da **Social One**.\n\n`;
  if (ragContext) {
    demoReply += `📚 **[RAG Ativo]** Identifiquei dados relevantes na sua base de conhecimento!\n\n`;
  }
  demoReply += `Nenhuma chave válida configurada para o provedor selecionado (**${provider.toUpperCase()}**). Por favor, cole sua chave no menu **Configurações (BYOAI)** para ativar as respostas automáticas.`;

  return {
    reply: demoReply,
    provider: 'Social One Demo Engine',
    ragInjected: !!ragContext,
  };
}
