import { NextResponse } from 'next/server';
import { getOrCreateDemoUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?googleAuth=error', request.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback` 
      : 'https://www.socialoneapp.com.br/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/?googleAuth=missing_keys', request.url));
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
      const googleEmail = userInfo.email || 'user@google.com';

      // Get or create user account in database for Google user
      const user = await getOrCreateDemoUser(googleEmail);
      const token = createSessionToken(user.id, user.email, user.role || 'user');

      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.cookies.set('socialone_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    return NextResponse.redirect(new URL('/?googleAuth=token_error', request.url));
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?googleAuth=exception', request.url));
  }
}
