import { NextResponse } from 'next/server';
import { getUpcomingAppointments24h, getWhatsAppInstance } from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/evolution';

export async function GET(req: Request) {
  try {
    const upcoming = await getUpcomingAppointments24h();
    const sentCount: string[] = [];

    for (const appt of upcoming) {
      const instance = await getWhatsAppInstance(appt.user_id);
      const instanceName = instance?.instance_name || 'socialone_admin';
      const formattedDate = new Date(appt.appointment_time).toLocaleDateString('pt-BR');
      const formattedTime = new Date(appt.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const confirmationMsg = `Olá ${appt.customer_name}! Passando para confirmar seu agendamento de *${appt.service_name}* para amanhã (${formattedDate} às ${formattedTime}).\n\nPor favor, responda:\n1️⃣ para *CONFIRMAR*\n2️⃣ para *REMARCAR*`;

      const remoteJid = appt.customer_phone.includes('@s.whatsapp.net') 
        ? appt.customer_phone 
        : `${appt.customer_phone.replace(/\D/g, '')}@s.whatsapp.net`;

      try {
        await sendWhatsAppMessage(instanceName, remoteJid, confirmationMsg);
        sentCount.push(appt.customer_name);
      } catch (sendErr) {
        console.error(`Error sending confirmation to ${appt.customer_name}:`, sendErr);
      }
    }

    return NextResponse.json({
      success: true,
      processed: upcoming.length,
      sentTo: sentCount,
      message: `Cron job de confirmação 24h executado com sucesso. ${sentCount.length} confirmações enviadas.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
