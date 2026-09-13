import { NextResponse } from 'next/server';
import { getUserProfile, updateUserBusinessModel, updateUserPlan } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    const profile = await getUserProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar perfil do usuário' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();
    const { businessModel, plan } = body;

    if (businessModel) {
      await updateUserBusinessModel(user.id, businessModel);
    }
    if (plan) {
      await updateUserPlan(user.id, plan);
    }

    const updatedProfile = await getUserProfile(user.id);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
