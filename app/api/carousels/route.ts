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
    const { userId = 1, topic, batchCount = 1 } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Tema não informado' }, { status: 400 });
    }

    const createdCarousels = [];
    const count = Math.min(Math.max(1, Number(batchCount)), 5);

    // Try AI generation if key is present
    const keys = await getAIKeys(userId);
    const openaiKeyObj = keys.find(k => k.provider === 'openai');
    const plainApiKey = openaiKeyObj ? decryptApiKey(openaiKeyObj.encrypted_api_key) : '';

    for (let i = 0; i < count; i++) {
      const carouselTopic = count > 1 ? `${topic.trim()} (Variação ${i + 1})` : topic.trim();
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
                  content: 'Você é um estrategista de conteúdo para Instagram. Responda ESTRITAMENTE em formato JSON contendo a estrutura do carrossel.'
                },
                {
                  role: 'user',
                  content: `Gere uma estrutura de carrossel de 5 slides para o Instagram sobre: "${carouselTopic}". Formato esperado JSON: {"title": "${carouselTopic}", "slides": [{"slide": 1, "title": "...", "description": "..."}]}`
                }
              ],
              response_format: { type: 'json_object' },
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
        title: carouselTopic,
        slides_count: slidesCount,
        date: 'Hoje'
      };

      const res = await saveCarousel(newCarousel);
      if (res.carousel) {
        createdCarousels.push(res.carousel);
      }
    }

    return NextResponse.json({
      success: true,
      carousels: createdCarousels,
      carousel: createdCarousels[0]
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
