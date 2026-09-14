import { NextResponse } from 'next/server';
import { generateAIReply } from '@/lib/ai';
import { getRecentChatMessages, saveChatMessage, getWhatsAppInstance } from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/evolution';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);
    const messages = await getRecentChatMessages(userId, 30);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId = 1, providerPreference, apiKey, systemPrompt } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    // 1. Save user message to database
    await saveChatMessage(userId, 'user', message, 'web_client');

    // 2. Generate AI reply with 15-message context memory
    const result = await generateAIReply({ 
      message, 
      userId, 
      remoteJid: 'web_client',
      providerPreference, 
      apiKey, 
      systemPrompt 
    });

    // 3. Save AI response to database
    await saveChatMessage(userId, 'assistant', result.reply, 'web_client');

    // 4. If WhatsApp instance is connected, optionally relay web message to WhatsApp
    const instance = await getWhatsAppInstance(userId);
    if (instance?.status === 'connected' && instance?.phone_number) {
      sendWhatsAppMessage(instance.instance_name || 'socialone_inst', instance.phone_number, result.reply).catch(() => {});
    }

    // 5. Fetch updated message list
    const updatedMessages = await getRecentChatMessages(userId, 30);

    return NextResponse.json({ 
      ...result,
      fallbackInfo: result.fallbackInfo,
      messages: updatedMessages 
    });
  } catch (error) {
    console.error('Error in AI Chat Route:', error);
    return NextResponse.json({ error: 'Falha no processamento da IA' }, { status: 500 });
  }
}
