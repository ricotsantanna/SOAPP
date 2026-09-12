import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/dashboard?googleAuth=error', request.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback` 
      : 'https://www.socialoneapp.com.br/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/dashboard?googleAuth=missing_keys', request.url));
    }

    // Exchange authorization code for OAuth tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenRes.json();
    if (tokens.access_token) {
      // Fetch user profile info from Google
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      const userInfo = await userRes.json();

      // Redirect back to dashboard with success and email
      const targetUrl = new URL('/dashboard', request.url);
      targetUrl.searchParams.set('googleAuth', 'success');
      targetUrl.searchParams.set('googleEmail', userInfo.email || '');
      return NextResponse.redirect(targetUrl);
    }

    return NextResponse.redirect(new URL('/dashboard?googleAuth=token_error', request.url));
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/dashboard?googleAuth=exception', request.url));
  }
}
