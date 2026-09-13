import { NextResponse } from 'next/server';
import { acceptExtraPackage } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    const result = await acceptExtraPackage(user.id);

    return NextResponse.json({
      success: true,
      message: 'Pacote Extra de 1.500 mensagens ativado com sucesso! R$ 10,00 adicionados à próxima fatura.',
      settings: result.settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao ativar pacote extra' },
      { status: 500 }
    );
  }
}
