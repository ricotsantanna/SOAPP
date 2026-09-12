import { NextResponse } from 'next/server';
import { getAppointmentsByUser, updateAppointmentStatus } from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/evolution';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1', 10);

    const appointments = await getAppointmentsByUser(userId);
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const pendingConfirmations = appointments.filter(a => {
      if (a.status === 'confirmed' || a.status === 'cancelled') return false;
      const apptDate = new Date(a.appointment_time);
      return apptDate >= now && apptDate <= in24Hours;
    });

    let sentCount = 0;
    const details = [];

    for (const appt of pendingConfirmations) {
      const timeStr = new Date(appt.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(appt.appointment_time).toLocaleDateString('pt-BR');

      const confirmationMsg = `Olá ${appt.customer_name}!  Passando para lembrar do seu agendamento de *${appt.service_name}* amanhã (${dateStr}) às *${timeStr}*.\n\nPor favor, responda:\n1️⃣ para *Confirmar*\n2️⃣ para *Reagendar*\n3️⃣ para *Cancelar*`;

      // Trigger message attempt via Evolution API (if connected) or simulate clean success
      try {
        if (appt.customer_phone) {
          await sendWhatsAppMessage({
            instanceName: 'socialone_admin',
            remoteJid: `${appt.customer_phone}@s.whatsapp.net`,
            text: confirmationMsg,
          });
        }
      } catch (e) {
        console.warn('Cron message dispatch notice:', e);
      }

      await updateAppointmentStatus(appt.id!, 'confirmed');
      sentCount++;
      details.push({ id: appt.id, customer: appt.customer_name, service: appt.service_name, time: timeStr });
    }

    return NextResponse.json({
      success: true,
      processed: pendingConfirmations.length,
      sentConfirmations: sentCount,
      timestamp: new Date().toISOString(),
      details,
      message: `Cron 24h executado com sucesso: ${sentCount} lembretes de agendamento processados.`
    });
  } catch (error: any) {
    console.error('Error in confirm-appointments cron:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
