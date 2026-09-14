import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { getUserProfile } from '@/lib/db';

export async function GET(req: Request) {
  try {
    let token: string | undefined = undefined;

    // Check Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('socialone_session')?.value;
    }

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const decoded = verifySessionToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, user: null });
    }

    const profile = await getUserProfile(decoded.userId);
    if (!profile) {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email?.split('@')[0] || '',
        role: profile.role || 'user',
        plan: profile.plan || 'start',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
