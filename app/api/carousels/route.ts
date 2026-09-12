import { NextResponse } from 'next/server';
import { getCarousels, saveCarousel, deleteCarousel, getAIKeys } from '@/lib/db';
import { decryptApiKey } from '@/lib/encryption';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const carousels = await getCarousels(userId);
    return NextResponse.json({ carousels });
  } catch (error) {
    console.error('Error fetching carousels:', error);
    return NextResponse.json({ error: 'Erro ao buscar carrosséis' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 1, topic } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Tema não informado' }, { status: 400 });
    }

    // Try AI generation if key is present
    const keys = await getAIKeys(userId);
    const openaiKeyObj = keys.find(k => k.provider === 'openai');
    const plainApiKey = openaiKeyObj ? decryptApiKey(openaiKeyObj.encrypted_api_key) : '';
    let slidesCount = 5;

    if (plainApiKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${plainApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em marketing digital e criação de carrosséis engajadores para o Instagram.'
              },
              {
                role: 'user',
                content: `Gere 5 tópicos/slides para um carrossel do Instagram sobre: ${topic}. Retorne apenas texto resumido.`
              }
            ],
            temperature: 0.7,
          }),
        });
        if (aiRes.ok) {
          slidesCount = 5;
        }
      } catch (err) {
        console.warn('AI Carousel generation fallback:', err);
      }
    }

    const newCarousel = {
      user_id: userId,
      title: topic.trim(),
      slides_count: slidesCount,
      date: 'Hoje'
    };

    const res = await saveCarousel(newCarousel);

    return NextResponse.json({
      success: true,
      carousel: res.carousel
    });
  } catch (error) {
    console.error('Error creating carousel:', error);
    return NextResponse.json({ error: 'Erro ao criar carrossel' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const userId = Number(searchParams.get('userId') || 1);

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await deleteCarousel(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel:', error);
    return NextResponse.json({ error: 'Erro ao excluir carrossel' }, { status: 500 });
  }
}
