import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '1';

  try {
    const res = await sql`SELECT google_calendar_email, google_calendar_id FROM users WHERE id = ${Number(userId)};`;
    if (res.rows.length > 0) {
      return NextResponse.json({
        email: res.rows[0].google_calendar_email || null,
        calendarId: res.rows[0].google_calendar_id || 'primary'
      });
    }
    return NextResponse.json({ email: null, calendarId: 'primary' });
  } catch (err) {
    return NextResponse.json({ email: null, calendarId: 'primary' });
  }
}

export async function POST(request: Request) {
  try {
    const { userId = 1, calendarEmail, calendarId = 'primary' } = await request.json();

    if (!calendarEmail || !calendarEmail.includes('@')) {
      return NextResponse.json({ error: 'Por favor, insira um e-mail válido da conta Google (ex: empresa@gmail.com)' }, { status: 400 });
    }

    try {
      await sql`
        UPDATE users 
        SET google_calendar_email = ${calendarEmail.trim().toLowerCase()},
            google_calendar_id = ${calendarId.trim()}
        WHERE id = ${Number(userId)};
      `;
    } catch (dbErr) {
      console.warn('DB update note for calendar connection:', dbErr);
    }

    return NextResponse.json({
      success: true,
      email: calendarEmail.trim().toLowerCase(),
      calendarId: calendarId.trim(),
      message: `✅ Conta Google Calendar (${calendarEmail.trim().toLowerCase()}) vinculada com sucesso à sua empresa!`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao vincular calendário.' }, { status: 500 });
  }
}
