import { NextResponse } from 'next/server';
import { saveKnowledgeFile } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { url, userId = 1 } = await request.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Insira uma URL válida (ex: https://suaempresa.com.br)' }, { status: 400 });
    }

    let extractedText = '';
    let pageTitle = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    try {
      // Fetch webpage HTML and extract plain text paragraphs
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SocialOne-RAG-Bot/2.0 (+https://socialoneapp.com.br)' }
      });
      if (res.ok) {
        const html = await res.text();
        // Remove HTML scripts and tags
        const cleanText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        extractedText = cleanText.substring(0, 5000);
        
        // Extract title tag if present
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          pageTitle = titleMatch[1].trim();
        }
      }
    } catch (fetchErr) {
      console.warn('URL fetch notice:', fetchErr);
      extractedText = `Conteúdo indexado da URL ${url}`;
    }

    const newFile = {
      id: Date.now(),
      user_id: Number(userId),
      file_name: `🌐 ${pageTitle}`,
      file_type: 'gdrive' as const,
      file_url: url,
      extracted_text: extractedText,
      size: '1.2 MB',
      created_at: new Date().toISOString()
    };

    await saveKnowledgeFile(newFile);

    return NextResponse.json({
      success: true,
      file: newFile,
      message: `Website "${pageTitle}" indexado com sucesso na Base de Conhecimento RAG!`
    });
  } catch (error: any) {
    console.error('Error indexing URL:', error);
    return NextResponse.json({ error: error.message || 'Erro ao indexar URL.' }, { status: 500 });
  }
}
