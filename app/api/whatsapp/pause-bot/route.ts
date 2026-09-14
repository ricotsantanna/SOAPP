import { NextResponse } from 'next/server';
import { pauseBotInstance, isBotPaused } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1', 10);
    const instanceName = searchParams.get('instanceName') || 'socialone_inst';

    const status = await isBotPaused(userId, instanceName);
    return NextResponse.json({ success: true, ...status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 1, instanceName = 'socialone_inst', durationHours } = body;

    // durationHours: number (e.g. 1, 2, 24) or null to unpause/resume
    const result = await pauseBotInstance(userId, instanceName, durationHours ?? null);
    return NextResponse.json({
      success: true,
      pausedUntil: result.pausedUntil,
      message: result.pausedUntil
        ? `IA Pausada para Atendimento Humano até ${new Date(result.pausedUntil).toLocaleString('pt-BR')}`
        : 'IA Reativada com sucesso para Atendimento Automático.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
