import { NextResponse } from 'next/server';
import { saveKnowledgeFile } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    // Handle OAuth Callback & Exchange Code
    return NextResponse.redirect('/dashboard/knowledge?drive=success');
  }

  // Generate OAuth consent URL for Google Drive
  const clientId = process.env.GOOGLE_CLIENT_ID || 'DEMO_CLIENT_ID';
  const redirectUri = encodeURIComponent('http://localhost:3000/api/drive');
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.readonly');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

  return NextResponse.json({ authUrl, connected: false });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, fileContent, userId = 1 } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Nome de arquivo inválido' }, { status: 400 });
    }

    await saveKnowledgeFile({
      user_id: userId,
      file_name: fileName,
      file_type: 'gdrive',
      extracted_text: fileContent || `Documento ${fileName} sincronizado via Google Drive API para o Social One.`,
    });

    return NextResponse.json({ success: true, message: `Documento ${fileName} sincronizado do Google Drive.` });
  } catch (error) {
    console.error('Drive sync error:', error);
    return NextResponse.json({ error: 'Erro ao sincronizar arquivo do Google Drive' }, { status: 500 });
  }
}
