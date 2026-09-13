import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const urlObj = new URL(request.url);
  const redirectUri = `${urlObj.origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({
      configured: false,
      message: '⚠️ Chaves do Google OAuth não configuradas no servidor.',
      requiredEnvVars: [
        { name: 'GOOGLE_CLIENT_ID', description: 'ID do Cliente OAuth obtido no Google Cloud Console' },
        { name: 'GOOGLE_CLIENT_SECRET', description: 'Chave Secreta do Cliente OAuth' },
        { name: 'NEXTAUTH_URL', description: 'URL base da aplicação (https://www.socialoneapp.com.br)' }
      ],
      instructions: [
        '1. Acesse https://console.cloud.google.com/apis/credentials',
        '2. Ative as APIs "Google Calendar API" e "Google People API"',
        '3. Crie credenciais do tipo "ID do cliente OAuth 2.0" (Aplicação Web)',
        '4. Adicione como URI de redirecionamento autorizado: https://www.socialoneapp.com.br/api/auth/google/callback',
        '5. Adicione as variáveis no painel da Vercel ou no arquivo .env.local'
      ]
    }, { status: 200 });
  }

  const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
