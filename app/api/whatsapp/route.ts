import { NextResponse } from 'next/server';
import { getWhatsAppInstance, saveWhatsAppInstance } from '@/lib/db';
import { fetchQrCode, sendWhatsAppMessage, getInstanceStatus } from '@/lib/evolution';
import { generateAIReply } from '@/lib/ai';

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

    // Log incoming webhook event
    const event = body?.event || body?.type;
    const instanceName = body?.instance || body?.instanceName || 'socialone_default';
    const data = body?.data || body;

    console.log(`[Evolution Webhook Received] Event: ${event} on Instance: ${instanceName}`);

    // Update connection status
    if (event === 'connection.update' || event === 'CONNECTION_UPDATE') {
      const state = data?.state || data?.instance?.state;
      if (state) {
        const status = state === 'open' ? 'connected' : state === 'connecting' ? 'connecting' : 'disconnected';
        await saveWhatsAppInstance(1, { status, phone_number: data?.owner || data?.instance?.owner });
      }
    }

    // Process Incoming Messages
    if (event === 'messages.upsert' || event === 'MESSAGES_UPSERT' || event === 'messages.update') {
      const msgObj = Array.isArray(data) ? data[0] : (data?.message ? data : data?.data);
      
      const key = msgObj?.key || msgObj?.message?.key;
      const remoteJid = key?.remoteJid || msgObj?.remoteJid;
      const isFromMe = key?.fromMe === true || key?.fromMe === 'true';

      // Avoid replying to self / system messages
      if (remoteJid && !isFromMe && !remoteJid.includes('@g.us')) {
        const messageContent = msgObj?.message || msgObj;
        const text = 
          messageContent?.conversation ||
          messageContent?.extendedTextMessage?.text ||
          messageContent?.imageMessage?.caption ||
          messageContent?.videoMessage?.caption ||
          messageContent?.documentMessage?.caption;

        if (text && text.trim()) {
          console.log(`[WhatsApp Incoming Message] From: ${remoteJid} -> Text: "${text}"`);

          // Directly call AI generation engine with RAG context
          const aiResult = await generateAIReply({ message: text, userId: 1 });
          console.log(`[WhatsApp AI Response] Generated via ${aiResult.provider}: "${aiResult.reply.substring(0, 50)}..."`);

          // Send back answer via WhatsApp Evolution API
          await sendWhatsAppMessage(instanceName, remoteJid, aiResult.reply);
        }
      }
    }

    return NextResponse.json({ status: 'webhook_processed' });
  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
