import { NextResponse } from 'next/server';
import { getAIKeys, saveAIKey, getWhatsAppInstance, saveWhatsAppInstance } from '@/lib/db';
import { encryptApiKey, decryptApiKey } from '@/lib/encryption';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const keys = await getAIKeys(userId);
    const instance = await getWhatsAppInstance(userId);

    const openaiObj = keys.find(k => k.provider === 'openai');
    const geminiObj = keys.find(k => k.provider === 'gemini');

    const openaiKey = openaiObj ? decryptApiKey(openaiObj.encrypted_api_key) : '';
    const geminiKey = geminiObj ? decryptApiKey(geminiObj.encrypted_api_key) : '';
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
    const { userId = 1, openaiKey, geminiKey, systemPrompt, activeProvider } = body;

    if (openaiKey !== undefined && openaiKey !== null) {
      const encryptedOpenai = encryptApiKey(openaiKey.trim());
      await saveAIKey(userId, 'openai', encryptedOpenai);
    }

    if (geminiKey !== undefined && geminiKey !== null) {
      const encryptedGemini = encryptApiKey(geminiKey.trim());
      await saveAIKey(userId, 'gemini', encryptedGemini);
    }

    await saveWhatsAppInstance(userId, {
      system_prompt: systemPrompt,
      active_provider: activeProvider || 'openai'
    });

    return NextResponse.json({ success: true, message: 'Configurações salvas e criptografadas com sucesso!' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
