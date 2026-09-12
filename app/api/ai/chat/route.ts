import { NextResponse } from 'next/server';
import { generateAIReply } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId = 1, providerPreference, apiKey, systemPrompt } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    const result = await generateAIReply({ message, userId, providerPreference, apiKey, systemPrompt });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in AI Chat Route:', error);
    return NextResponse.json({ error: 'Falha no processamento da IA' }, { status: 500 });
  }
}
