import { NextResponse } from 'next/server';
import { getAIKeys, saveAIKey, getWhatsAppInstance, saveWhatsAppInstance } from '@/lib/db';
import { encryptApiKey, decryptApiKey } from '@/lib/encryption';

async function validateOpenAIKey(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key || key.includes('xxxx') || key.includes('••••')) return { valid: false, error: 'Chave não preenchida' };
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key.trim()}` }
    });
    if (res.ok) return { valid: true };
    const data = await res.json().catch(() => ({}));
    return { valid: false, error: data?.error?.message || `HTTP ${res.status}` };
  } catch (err: any) {
    return { valid: false, error: err?.message };
  }
}

async function validateGeminiKey(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key || key.includes('xxxx') || key.includes('••••')) return { valid: false, error: 'Chave não preenchida' };
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key.trim()}`);
    if (res.ok) return { valid: true };
    const data = await res.json().catch(() => ({}));
    return { valid: false, error: data?.error?.message || `HTTP ${res.status}` };
  } catch (err: any) {
    return { valid: false, error: err?.message };
  }
}

async function validateClaudeKey(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key || key.includes('xxxx') || key.includes('••••')) return { valid: false, error: 'Chave não preenchida' };
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key.trim(),
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }]
      })
    });
    if (res.ok) return { valid: true };
    const data = await res.json().catch(() => ({}));
    return { valid: false, error: data?.error?.message || `HTTP ${res.status}` };
  } catch (err: any) {
    return { valid: false, error: err?.message };
  }
}

async function validateNvidiaKey(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key || key.includes('xxxx') || key.includes('••••')) return { valid: false, error: 'Chave não preenchida' };
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
      headers: { Authorization: `Bearer ${key.trim()}` }
    });
    if (res.ok) return { valid: true };
    const data = await res.json().catch(() => ({}));
    return { valid: false, error: data?.error?.message || `HTTP ${res.status}` };
  } catch (err: any) {
    return { valid: false, error: err?.message };
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const keys = await getAIKeys(userId);
    const instance = await getWhatsAppInstance(userId);

    const openaiObj = keys.find(k => k.provider === 'openai');
    const geminiObj = keys.find(k => k.provider === 'gemini');
    const claudeObj = keys.find(k => k.provider === 'claude');
    const nvidiaObj = keys.find(k => k.provider === 'nvidia');
    const customObj = keys.find(k => k.provider === 'custom');

    const decryptClean = (obj?: typeof openaiObj) => {
      if (!obj) return '';
      const dec = decryptApiKey(obj.encrypted_api_key);
      return dec.includes('xxxx') || dec.includes('••••') ? '' : dec;
    };

    const openaiKey = decryptClean(openaiObj);
    const geminiKey = decryptClean(geminiObj);
    const claudeKey = decryptClean(claudeObj);
    const nvidiaKey = decryptClean(nvidiaObj);
    const customKey = decryptClean(customObj);

    const systemPrompt = instance?.system_prompt || 'Você é o assistente virtual oficial da empresa. Atenda os clientes via WhatsApp com máxima cordialidade e responda com base nos documentos da base de conhecimento.';
    const activeProvider = instance?.active_provider || 'openai';
    const customBaseUrl = instance?.custom_base_url || 'https://api.groq.com/openai/v1';
    const customModelName = instance?.custom_model_name || 'llama-3.1-8b-instant';

    return NextResponse.json({
      success: true,
      data: {
        openaiKey,
        geminiKey,
        claudeKey,
        nvidiaKey,
        customKey,
        systemPrompt,
        activeProvider,
        customBaseUrl,
        customModelName,
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Erro ao carregar configurações' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 1,
      openaiKey,
      geminiKey,
      claudeKey,
      nvidiaKey,
      customKey,
      systemPrompt,
      activeProvider = 'openai',
      customBaseUrl,
      customModelName
    } = body;

    let validationNotice = '';

    const saveKeyIfPresent = async (provider: 'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom', keyVal?: string) => {
      if (keyVal !== undefined && keyVal !== null) {
        const cleanKey = keyVal.trim();
        if (cleanKey && !cleanKey.includes('xxxx')) {
          const encrypted = encryptApiKey(cleanKey);
          await saveAIKey(userId, provider, encrypted);
        }
      }
    };

    await saveKeyIfPresent('openai', openaiKey);
    await saveKeyIfPresent('gemini', geminiKey);
    await saveKeyIfPresent('claude', claudeKey);
    await saveKeyIfPresent('nvidia', nvidiaKey);
    await saveKeyIfPresent('custom', customKey);

    // Validate active provider key
    if (activeProvider === 'openai' && openaiKey) {
      const val = await validateOpenAIKey(openaiKey.trim());
      validationNotice = val.valid
        ? '✅ Chave OpenAI validada e salva com sucesso!'
        : `⚠️ Chave OpenAI salva, mas retornou um alerta ao testar: ${val.error}`;
    } else if (activeProvider === 'gemini' && geminiKey) {
      const val = await validateGeminiKey(geminiKey.trim());
      validationNotice = val.valid
        ? '✅ Chave Google Gemini validada e salva com sucesso!'
        : `⚠️ Chave Google Gemini salva, mas retornou um alerta ao testar: ${val.error}`;
    } else if (activeProvider === 'claude' && claudeKey) {
      const val = await validateClaudeKey(claudeKey.trim());
      validationNotice = val.valid
        ? '✅ Chave Anthropic Claude validada e salva com sucesso!'
        : `⚠️ Chave Claude salva, mas retornou um alerta ao testar: ${val.error}`;
    } else if (activeProvider === 'nvidia' && nvidiaKey) {
      const val = await validateNvidiaKey(nvidiaKey.trim());
      validationNotice = val.valid
        ? '✅ Chave NVIDIA NIM validada e salva com sucesso!'
        : `⚠️ Chave NVIDIA NIM salva, mas retornou um alerta ao testar: ${val.error}`;
    }

    await saveWhatsAppInstance(userId, {
      system_prompt: systemPrompt,
      active_provider: activeProvider,
      custom_base_url: customBaseUrl,
      custom_model_name: customModelName
    });

    if (!validationNotice) {
      validationNotice = '✅ Configurações e Persona salvas com sucesso!';
    }

    return NextResponse.json({
      success: true,
      message: validationNotice,
      activeProvider
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
