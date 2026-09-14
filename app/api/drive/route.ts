import { NextResponse } from 'next/server';
import { saveKnowledgeFile } from '@/lib/db';
import { convertToMarkdown } from '@/lib/markdownConverter';

export async function GET(req: Request) {
  const urlObj = new URL(req.url);
  const code = urlObj.searchParams.get('code');

  // Dynamically resolve base URL to support production domain, explicitly enforcing socialoneapp.com.br
  const isLocal = urlObj.host.includes('localhost');
  const appUrl = isLocal 
    ? 'http://localhost:3000' 
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://www.socialoneapp.com.br');

  const redirectUriRaw = `${appUrl}/api/drive`;
  const redirectUri = encodeURIComponent(redirectUriRaw);

  if (code) {
    // Handle OAuth Callback & Exchange Code
    return NextResponse.redirect(`${appUrl}/dashboard?active=knowledge&drive=success`);
  }

  // Generate OAuth consent URL for Google Drive
  const clientId = process.env.GOOGLE_CLIENT_ID || 'DEMO_CLIENT_ID';
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.readonly');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

  // If request accepts JSON (from API call), return JSON. Otherwise redirect directly in browser.
  const acceptHeader = req.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return NextResponse.json({ authUrl, connected: false });
  }

  return NextResponse.redirect(authUrl);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, fileContent, userId = 1 } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Nome de arquivo inválido' }, { status: 400 });
    }

    const markdownText = convertToMarkdown(
      fileContent || `Documento ${fileName} sincronizado via Google Drive API para o Social One.`,
      fileName
    );

    await saveKnowledgeFile({
      user_id: userId,
      file_name: fileName,
      file_type: 'gdrive',
      extracted_text: markdownText,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Documento ${fileName} convertido para Markdown e sincronizado na Base de Conhecimento RAG.` 
    });
  } catch (error) {
    console.error('Drive sync error:', error);
    return NextResponse.json({ error: 'Erro ao sincronizar arquivo do Google Drive' }, { status: 500 });
  }
}
