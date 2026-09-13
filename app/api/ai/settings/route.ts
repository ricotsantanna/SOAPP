import { NextResponse } from 'next/server';
import { getAISettings, updateAISettings, getOrCreateDemoUser } from '@/lib/db';

export async function GET() {
  try {
    const user = await getOrCreateDemoUser();
    const settings = await getAISettings(user.id);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Erro ao carregar configurações de IA' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDemoUser();
    const body = await req.json();

    const updated = await updateAISettings(user.id, {
      billing_mode: body.billing_mode,
      api_provider: body.api_provider,
      api_key: body.api_key,
      system_prompt: body.system_prompt,
      bot_paused_until: body.bot_paused_until,
      monthly_message_limit: body.monthly_message_limit,
      is_quota_blocked: body.is_quota_blocked
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Erro ao atualizar configurações de IA' }, { status: 500 });
  }
}
