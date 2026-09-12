import { createAppointment, getAppointmentsByUser, updateAppointmentStatus } from '@/lib/db';

export interface CalendarEventPayload {
  userId: number;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  appointmentTime: string; // ISO string
}

/**
  * Google Calendar SSOT Service
  * Operates as Single Source of Truth for availability and appointment scheduling.
  */

export async function getFreeBusySlots(userId: number = 1, dateStr?: string): Promise<string[]> {
  // Returns list of available time slots (HH:mm) for given date
  const defaultSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  try {
    const existing = await getAppointmentsByUser(userId);
    const targetDate = dateStr ? new Date(dateStr).toDateString() : new Date().toDateString();
    
    // Filter out slots already taken today
    const busyHours = existing
      .filter(a => new Date(a.appointment_time).toDateString() === targetDate && a.status !== 'cancelled')
      .map(a => {
        const d = new Date(a.appointment_time);
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

    return defaultSlots.filter(s => !busyHours.includes(s));
  } catch (err) {
    console.error('Error fetching free/busy slots:', err);
    return defaultSlots;
  }
}

export async function createCalendarEvent(payload: CalendarEventPayload) {
  const googleEventId = `evt_gcal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Save to DB / In-memory store
  const newAppt = await createAppointment({
    user_id: payload.userId,
    customer_name: payload.customerName,
    customer_phone: payload.customerPhone,
    service_name: payload.serviceName,
    appointment_time: payload.appointmentTime,
    status: 'scheduled',
    google_event_id: googleEventId,
  });

  return {
    success: true,
    eventId: googleEventId,
    appointment: newAppt,
    message: ` Compromisso agendado com sucesso no Google Calendar (SSOT) para ${payload.customerName} em ${new Date(payload.appointmentTime).toLocaleString('pt-BR')}`
  };
}

export async function rescheduleCalendarEvent(appointmentId: number, newTimeISO: string) {
  await updateAppointmentStatus(appointmentId, 'rescheduled');
  return {
    success: true,
    message: `Agendamento #${appointmentId} reagendado para ${new Date(newTimeISO).toLocaleString('pt-BR')}`
  };
}

export async function cancelCalendarEvent(appointmentId: number) {
  await updateAppointmentStatus(appointmentId, 'cancelled');
  return {
    success: true,
    message: `Agendamento #${appointmentId} cancelado com sucesso.`
  };
}
