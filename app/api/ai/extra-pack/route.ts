import { NextResponse } from 'next/server';
import { acceptExtraPackage, getOrCreateDemoUser } from '@/lib/db';

export async function POST() {
  try {
    const user = await getOrCreateDemoUser();
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
