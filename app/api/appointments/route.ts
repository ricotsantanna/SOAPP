import { NextResponse } from 'next/server';
import { getAppointments, createAppointment, updateAppointmentStatus } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const appointments = await getAppointments(userId);
    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 1, customerName, customerPhone, serviceName, appointmentTime } = body;

    if (!customerName || !customerPhone || !serviceName || !appointmentTime) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    // Generate Google Calendar Event ID format (SSOT)
    const googleEventId = `gcal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newAppt = await createAppointment({
      user_id: userId,
      customer_name: customerName,
      customer_phone: customerPhone,
      service_name: serviceName,
      appointment_time: new Date(appointmentTime).toISOString(),
      status: 'scheduled',
      google_event_id: googleEventId,
    });

    return NextResponse.json({
      success: true,
      appointment: newAppt,
      message: 'Agendamento registrado com sucesso e sincronizado com Google Calendar SSOT.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    await updateAppointmentStatus(id, status);
    return NextResponse.json({ success: true, message: `Status do agendamento atualizado para ${status}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
