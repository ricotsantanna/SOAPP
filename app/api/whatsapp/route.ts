import { NextResponse } from 'next/server';
import { getWhatsAppInstance, saveWhatsAppInstance } from '@/lib/db';
import { fetchQrCode, sendWhatsAppMessage, getInstanceStatus } from '@/lib/evolution';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const userId = Number(searchParams.get('userId') || 1);

  const instance = await getWhatsAppInstance(userId);
  const instanceName = instance?.instance_name || 'socialone_default';

  if (action === 'qrcode') {
    const qrData = await fetchQrCode(instanceName);
    return NextResponse.json(qrData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  if (action === 'status') {
    const statusData = await getInstanceStatus(instanceName);
    if (instance) {
      await saveWhatsAppInstance(userId, { status: statusData.status, phone_number: statusData.phone });
    }
    return NextResponse.json(statusData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  return NextResponse.json({ instance, instanceName });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Evolution API Webhook Event Handler
    const { event, instance: instanceName, data } = body;

    console.log(`[Evolution Webhook] Event: ${event} on Instance: ${instanceName}`);

    // Update connection status
    if (event === 'connection.update') {
      const state = data?.state;
      if (state) {
        const status = state === 'open' ? 'connected' : state === 'connecting' ? 'connecting' : 'disconnected';
        await saveWhatsAppInstance(1, { status, phone_number: data?.owner });
      }
    }

    // Process Incoming Messages
    if (event === 'messages.upsert') {
      const messageObj = data?.message;
      const remoteJid = data?.key?.remoteJid;
      const isFromMe = data?.key?.fromMe;

      // Avoid replying to own messages
      if (messageObj && remoteJid && !isFromMe) {
        const text = messageObj?.conversation || messageObj?.extendedTextMessage?.text;

        if (text) {
          console.log(`[WhatsApp Incoming] From: ${remoteJid} Text: ${text}`);

          // Trigger internal AI response processor
          const host = req.headers.get('host') || 'localhost:3000';
          const protocol = host.includes('localhost') ? 'http' : 'https';

          const aiRes = await fetch(`${protocol}://${host}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, userId: 1 }),
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            const replyText = aiData.reply;

            // Send back reply via WhatsApp Evolution API
            await sendWhatsAppMessage(instanceName, remoteJid, replyText);
          }
        }
      }
    }

    return NextResponse.json({ status: 'webhook_received' });
  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
