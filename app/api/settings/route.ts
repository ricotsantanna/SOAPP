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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const keys = await getAIKeys(userId);
    const instance = await getWhatsAppInstance(userId);

    const openaiObj = keys.find(k => k.provider === 'openai');
    const geminiObj = keys.find(k => k.provider === 'gemini');

    let openaiKey = openaiObj ? decryptApiKey(openaiObj.encrypted_api_key) : '';
    let geminiKey = geminiObj ? decryptApiKey(geminiObj.encrypted_api_key) : '';

    if (openaiKey.includes('xxxx') || openaiKey.includes('••••')) openaiKey = '';
    if (geminiKey.includes('xxxx') || geminiKey.includes('••••')) geminiKey = '';

    const systemPrompt = instance?.system_prompt || 'Você é o assistente virtual oficial da empresa. Atenda os clientes via WhatsApp com máxima cordialidade e responda com base nos documentos da base de conhecimento.';
    const activeProvider = instance?.active_provider || (openaiKey ? 'openai' : geminiKey ? 'gemini' : 'openai');

    return NextResponse.json({
      openaiKey,
      geminiKey,
      systemPrompt,
      activeProvider,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 1, openaiKey, geminiKey, systemPrompt, activeProvider = 'openai' } = body;

    let validationNotice = '';

    if (openaiKey !== undefined && openaiKey !== null) {
      const cleanKey = openaiKey.trim();
      if (cleanKey && !cleanKey.includes('xxxx')) {
        const encryptedOpenai = encryptApiKey(cleanKey);
        await saveAIKey(userId, 'openai', encryptedOpenai);

        if (activeProvider === 'openai') {
          const val = await validateOpenAIKey(cleanKey);
          if (!val.valid) {
            validationNotice = `⚠️ Chave OpenAI salva, mas retornou um alerta ao testar: ${val.error}`;
          } else {
            validationNotice = `✅ Chave OpenAI validada e salva com sucesso!`;
          }
        }
      }
    }

    if (geminiKey !== undefined && geminiKey !== null) {
      const cleanKey = geminiKey.trim();
      if (cleanKey && !cleanKey.includes('xxxx')) {
        const encryptedGemini = encryptApiKey(cleanKey);
        await saveAIKey(userId, 'gemini', encryptedGemini);

        if (activeProvider === 'gemini') {
          const val = await validateGeminiKey(cleanKey);
          if (!val.valid) {
            validationNotice = `⚠️ Chave Gemini salva, mas retornou um alerta ao testar: ${val.error}`;
          } else {
            validationNotice = `✅ Chave Google Gemini validada e salva com sucesso!`;
          }
        }
      }
    }

    await saveWhatsAppInstance(userId, {
      system_prompt: systemPrompt,
      active_provider: activeProvider
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
