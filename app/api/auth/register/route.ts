import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'E-mail e senha (mínimo 6 caracteres) são obrigatórios' }, { status: 400 });
    }

    const regResult = await registerUser(email, password);

    if (!regResult.success || !regResult.user) {
      return NextResponse.json({ error: regResult.error || 'Erro ao registrar usuário' }, { status: 400 });
    }

    const user = regResult.user;
    const token = createSessionToken(user.id, user.email, user.role || 'user');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      token
    });

    response.cookies.set('socialone_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in register route:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar novo usuário' }, { status: 500 });
  }
}
