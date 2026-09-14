import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { updateUserName, getUserProfile } from '@/lib/db';

// GET: Fetch user profile (name, email, plan, role)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qUserId = searchParams.get('userId');

    let userId: number | null = qUserId ? Number(qUserId) : null;

    if (!userId) {
      const cookieStore = cookies();
      const token = cookieStore.get('socialone_session')?.value;
      if (token) {
        const decoded = verifySessionToken(token);
        if (decoded?.userId) userId = decoded.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    const profile = await getUserProfile(userId);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email?.split('@')[0] || '',
        role: profile.role,
        plan: profile.plan,
        business_model: profile.business_model,
      }
    });
  } catch (error) {
    console.error('Error in profile GET:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar perfil' }, { status: 500 });
  }
}

// POST: Update user name (and optionally business model/plan)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, businessModel, plan } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId é obrigatório' }, { status: 400 });
    }

    // Update name if provided
    if (name && name.trim()) {
      await updateUserName(Number(userId), name.trim());
    }

    // Update business model if provided
    if (businessModel) {
      const { updateUserBusinessModel } = await import('@/lib/db');
      await updateUserBusinessModel(Number(userId), businessModel);
    }

    // Update plan if provided
    if (plan) {
      const { updateUserPlan } = await import('@/lib/db');
      await updateUserPlan(Number(userId), plan);
    }

    const updated = await getUserProfile(Number(userId));
    return NextResponse.json({
      success: true,
      profile: {
        id: updated?.id,
        email: updated?.email,
        name: updated?.name || updated?.email?.split('@')[0] || '',
        role: updated?.role,
        plan: updated?.plan,
        business_model: updated?.business_model,
      }
    });
  } catch (error) {
    console.error('Error in profile POST:', error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
