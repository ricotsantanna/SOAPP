import { NextResponse } from 'next/server';
import { getWhatsAppInstance, getInstanceByInstanceName, saveWhatsAppInstance, saveChatMessage, isBotPaused } from '@/lib/db';
import { fetchQrCode, sendWhatsAppMessage, getInstanceStatus, logoutInstance } from '@/lib/evolution';
import { generateAIReply } from '@/lib/ai';
import { getAuthenticatedUser } from '@/lib/session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  const user = await getAuthenticatedUser(req);
  const userId = user.id;

  const instance = await getWhatsAppInstance(userId);
  const instanceName = instance?.instance_name || (userId === 1 ? 'socialone_inst' : `inst_user_${userId}`);

  if (action === 'logout') {
    const logoutRes = await logoutInstance(instanceName);
    await saveWhatsAppInstance(userId, { instance_name: instanceName, status: 'disconnected', phone_number: '' });
    return NextResponse.json(logoutRes);
  }

  if (action === 'qrcode') {
    const qrData = await fetchQrCode(instanceName);
    if (qrData.status === 'connected') {
      await saveWhatsAppInstance(userId, { instance_name: instanceName, status: 'connected' });
    }
    return NextResponse.json(qrData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  if (action === 'status') {
    const statusData = await getInstanceStatus(instanceName);
    await saveWhatsAppInstance(userId, { 
      instance_name: statusData.instanceName || instanceName, 
      status: statusData.status, 
      phone_number: statusData.phone 
    });
    return NextResponse.json(statusData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  if (action === 'setup-webhook') {
    try {
      const baseUrl = (process.env.EVOLUTION_API_URL || 'https://markei-evolution-api.ro91ry.easypanel.host').replace(/\/$/, '').replace(/\/manager$/, '');
      const apiKey = process.env.EVOLUTION_API_KEY || 'c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH';
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialoneapp.com.br';
      const webhookUrl = `${appUrl}/api/whatsapp`;

      const headers = {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      };

      // Evolution API v2 uses camelCase — try POST first, then PUT as fallback
      const payloadV2 = {
        url: webhookUrl,
        webhookByEvents: false,
        webhookBase64: false,
        events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
      };

      // Also try wrapped format used by some Evolution API versions
      const payloadWrapped = {
        webhook: {
          enabled: true,
          url: webhookUrl,
          webhookByEvents: false,
          webhookBase64: false,
          events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
        }
      };

      // Try 1: POST /webhook/set/{instance} with v2 flat payload
      let res = await fetch(`${baseUrl}/webhook/set/${instanceName}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payloadV2),
      });

      // Try 2: PUT /webhook/set/{instance}
      if (!res.ok) {
        res = await fetch(`${baseUrl}/webhook/set/${instanceName}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payloadV2),
        });
      }

      // Try 3: POST with wrapped payload
      if (!res.ok) {
        res = await fetch(`${baseUrl}/webhook/set/${instanceName}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payloadWrapped),
        });
      }

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ success: true, webhookUrl, data });
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData?.message || errData?.error || JSON.stringify(errData).substring(0, 200);
        return NextResponse.json({
          success: false,
          error: `Não foi possível configurar o webhook (HTTP ${res.status}): ${errMsg}. Webhook URL que seria usada: ${webhookUrl}`,
        });
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err?.message || 'Falha ao configurar webhook na Evolution API' });
    }
  }


  return NextResponse.json({ instance, instanceName });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log incoming webhook event
    const event = body?.event || body?.type || '';
    const instanceName = body?.instance || body?.instanceName || 'socialone_admin';
    const data = body?.data || body;

    console.log(`[Evolution Webhook Received] Event: ${event} on Instance: ${instanceName}`);

    // Update connection status
    const eventUpper = String(event).toUpperCase();
    if (eventUpper.includes('CONNECTION') || eventUpper.includes('STATE')) {
      const state = data?.state || data?.instance?.state;
      if (state) {
        const status = state === 'open' ? 'connected' : state === 'connecting' ? 'connecting' : 'disconnected';
        await saveWhatsAppInstance(1, { status, phone_number: data?.owner || data?.instance?.owner });
      }
    }

    // Process Incoming Messages
    if (eventUpper.includes('MESSAGES') || eventUpper.includes('SEND_MESSAGE')) {
      const msgObj = Array.isArray(data) ? data[0] : (data?.message ? data : data?.data || data);
      
      const key = msgObj?.key || msgObj?.message?.key;
      const remoteJid = key?.remoteJid || msgObj?.remoteJid;
      const isFromMe = key?.fromMe === true || key?.fromMe === 'true';

      // Avoid replying to self / group messages
      if (remoteJid && !isFromMe && !remoteJid.includes('@g.us')) {
        const messageContent = msgObj?.message || msgObj;
        const text = 
          messageContent?.conversation ||
          messageContent?.extendedTextMessage?.text ||
          messageContent?.imageMessage?.caption ||
          messageContent?.videoMessage?.caption ||
          messageContent?.documentMessage?.caption ||
          (typeof messageContent === 'string' ? messageContent : '');

        if (text && text.trim()) {
          console.log(`[WhatsApp Incoming Message] From: ${remoteJid} -> Text: "${text}"`);

          const instObj = await getInstanceByInstanceName(instanceName);
          const targetUserId = instObj?.user_id || 1;

          // 1. Save customer message to DB
          await saveChatMessage(targetUserId, 'user', text, remoteJid);

          // 2. Check if bot is paused for human handoff
          const pauseStatus = await isBotPaused(targetUserId, instanceName);
          if (pauseStatus.isPaused) {
            console.log(`[WhatsApp AI Paused] Bot is paused for instance ${instanceName} until ${pauseStatus.pausedUntil}. Skipping automatic AI response.`);
            return NextResponse.json({ status: 'bot_paused_for_human' });
          }

          // 3. Call AI generation engine with 15-message memory
          const aiResult = await generateAIReply({ 
            message: text, 
            userId: targetUserId,
            remoteJid,
          });
          console.log(`[WhatsApp AI Response] Generated via ${aiResult.provider}: "${aiResult.reply.substring(0, 50)}..."`);

          // 4. Save AI reply to DB
          await saveChatMessage(targetUserId, 'assistant', aiResult.reply, remoteJid);

          // 5. Send back answer via WhatsApp Evolution API
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
