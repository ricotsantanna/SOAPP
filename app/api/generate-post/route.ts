import { NextResponse } from 'next/server';
import { getAIKeys, getWhatsAppInstance, saveCarousel } from '@/lib/db';
import { decryptApiKey } from '@/lib/encryption';
import { buildRAGContext } from '@/lib/rag';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, slidesCount = 5, userId = 1 } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'O tópico do carrossel é obrigatório.' }, { status: 400 });
    }

    const ragContext = await buildRAGContext(userId, topic);
    const userKeys = await getAIKeys(userId);
    const instance = await getWhatsAppInstance(userId);

    let provider = instance?.active_provider || 'openai';
    let apiKey = '';

    const keyObj = userKeys.find(k => k.provider === provider && k.encrypted_api_key);
    if (keyObj) {
      apiKey = decryptApiKey(keyObj.encrypted_api_key);
    }

    if (!apiKey || apiKey.includes('xxxx')) {
      // Fallback key search
      const fallbackKey = userKeys.find(k => k.encrypted_api_key && !decryptApiKey(k.encrypted_api_key).includes('xxxx'));
      if (fallbackKey) {
        provider = fallbackKey.provider;
        apiKey = decryptApiKey(fallbackKey.encrypted_api_key);
      }
    }

    // Default response mock structure if no API key is set yet
    let carouselResult = {
      title: topic,
      slidesCount: slidesCount,
      slides: Array.from({ length: slidesCount }, (_, i) => ({
        slideNumber: i + 1,
        headline: i === 0 ? topic : `Passo ${i}: Estratégia de Alto Impacto`,
        text: `Dica valiosa sobre ${topic}. Implemente para maximizar a conversão de vendas no WhatsApp e Instagram.`,
        visualPrompt: `Design moderno com fundo roxo #581C87, detalhes em amarelo #FACC15 e tipografia limpa.`
      })),
      caption: `🚀 Confira este carrossel especial sobre: ${topic}!\n\nSalve este post para consultar depois e compartilhe com quem precisa saber disso!`,
      hashtags: ['#SocialOne', '#IA', '#MarketingDigital', '#Automação', '#VendasOnline']
    };

    // If active API key is available, call OpenAI for Structured Output JSON
    if (apiKey && provider === 'openai') {
      try {
        const systemPrompt = `Você é um especialista em marketing de conteúdo e copywriting para Instagram.
Gere um carrossel educativo de ${slidesCount} slides sobre o tema fornecido.
${ragContext ? `Utilize estas informações da empresa: ${ragContext}` : ''}
Responda EXCLUSIVAMENTE em formato JSON válido com a estrutura:
{
  "title": "Título Principal",
  "slides": [
    { "slideNumber": 1, "headline": "...", "text": "...", "visualPrompt": "..." }
  ],
  "caption": "Legenda do post",
  "hashtags": ["#tag1", "#tag2"]
}`;

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Crie um carrossel sobre: ${topic}` }
            ]
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const parsed = JSON.parse(aiData.choices?.[0]?.message?.content || '{}');
          if (parsed.title && Array.isArray(parsed.slides)) {
            carouselResult = {
              title: parsed.title,
              slidesCount: parsed.slides.length,
              slides: parsed.slides,
              caption: parsed.caption || carouselResult.caption,
              hashtags: parsed.hashtags || carouselResult.hashtags
            };
          }
        }
      } catch (err) {
        console.warn('OpenAI carousel generation warning (using fallback mock):', err);
      }
    }

    // Save to DB / In-memory store
    const saveRes = await saveCarousel({
      user_id: userId,
      title: carouselResult.title,
      slides_count: carouselResult.slidesCount,
      date: 'Hoje'
    });

    const savedCarousel = saveRes.carousel || { id: Date.now(), ...carouselResult };

    return NextResponse.json({
      success: true,
      carousel: {
        id: savedCarousel.id,
        ...carouselResult
      }
    });
  } catch (error: any) {
    console.error('Error generating carousel:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar carrossel.' }, { status: 500 });
  }
}
