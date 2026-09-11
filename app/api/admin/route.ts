import { NextResponse } from 'next/server';
import { getPlatformStats, getAllUsers, getAllWhatsAppInstances, toggleUserRole } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const stats = await getPlatformStats();
    const users = await getAllUsers();
    const instances = await getAllWhatsAppInstances();

    return NextResponse.json({
      stats,
      users,
      instances
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: 'Falha ao buscar dados administrativos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId } = body;

    if (action === 'toggle_role' && userId) {
      const result = await toggleUserRole(Number(userId));
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: true, message: 'Ação administrativa executada.' });
  } catch (error) {
    console.error('Error in admin POST action:', error);
    return NextResponse.json({ error: 'Erro ao executar ação administrativa' }, { status: 500 });
  }
}
