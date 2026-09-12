import { NextResponse } from 'next/server';
import { getUserProfile, updateUserBusinessModel, updateUserPlan } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);
    const profile = await getUserProfile(userId);
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar perfil do usuário' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 1, businessModel, plan } = body;

    if (businessModel) {
      await updateUserBusinessModel(userId, businessModel);
    }
    if (plan) {
      await updateUserPlan(userId, plan);
    }

    const updatedProfile = await getUserProfile(userId);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
