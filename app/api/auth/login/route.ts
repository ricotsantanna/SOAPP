import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
    }

    const authResult = await authenticateUser(email, password);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Credenciais inválidas' }, { status: 401 });
    }

    const user = authResult.user;
    const token = createSessionToken(user.id, user.email, user.role || 'user');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        plan: user.plan || 'start'
      },
      token
    });

    // Set HTTP-only session cookie
    response.cookies.set('socialone_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json({ error: 'Erro no processamento de autenticação' }, { status: 500 });
  }
}
