export interface EvolutionInstanceInfo {
  instanceName: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrcode?: string;
  pairingCode?: string;
  phone?: string;
}

/**
 * Gets the Evolution API base URL (Default or VPS override).
 * Pre-configured for Easypanel Evolution API: https://markei-evolution-api.ro91ry.easypanel.host
 */
export function getEvolutionBaseUrl(): string {
  const url = process.env.EVOLUTION_API_URL || 'https://markei-evolution-api.ro91ry.easypanel.host';
  return url.replace(/\/$/, '').replace(/\/manager$/, ''); // Clean trailing slashes or /manager path
}

/**
 * Gets the Global Evolution API Key.
 * Pre-configured for Easypanel key: c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH
 */
export function getEvolutionApiKey(): string {
  return process.env.EVOLUTION_API_KEY || 'c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH';
}

/**
 * Helper to ensure a base64 string is formatted properly as an image data URI.
 */
function formatQrCodeBase64(rawQr?: string): string | undefined {
  if (!rawQr) return undefined;
  if (rawQr.startsWith('data:image')) return rawQr;
  // If raw base64 string without data URI scheme
  if (rawQr.length > 100) {
    return `data:image/png;base64,${rawQr}`;
  }
  return rawQr;
}

/**
 * Tests connection & health of your Evolution API VPS / Easypanel.
 */
export async function testVpsConnection(customUrl?: string, customKey?: string): Promise<{ online: boolean; version?: string; message: string }> {
  const rawUrl = customUrl || getEvolutionBaseUrl();
  const baseUrl = rawUrl.replace(/\/$/, '').replace(/\/manager$/, '');
  const apiKey = customKey || getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/fetchInstances`, {
      method: 'GET',
      headers: { 'apikey': apiKey },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        version: 'v2.0 (Easypanel)',
        message: `Evolution API conectada com sucesso em ${baseUrl}! ${Array.isArray(data) ? data.length : 0} instâncias ativas no servidor.`,
      };
    } else {
      return {
        online: false,
        message: `Evolution API alcançada em ${baseUrl}, mas respondeu com erro HTTP ${res.status}. Verifique a Global API Key.`,
      };
    }
  } catch (error) {
    return {
      online: false,
      message: `Não foi possível alcançar a Evolution API em ${baseUrl}. Verifique se a API está ativa no Easypanel.`,
    };
  }
}

/**
 * Automatically registers the Vercel Webhook URL on your Evolution API.
 */
export async function registerVpsWebhook(instanceName: string, webhookUrl: string): Promise<boolean> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/webhook/set/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        enabled: true,
        url: webhookUrl,
        byEvents: false,
        base64: false,
        events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to auto-register Webhook:', error);
    return false;
  }
}

/**
 * Creates or fetches a WhatsApp instance on your Easypanel Evolution API.
 */
export async function getOrCreateInstance(instanceName: string = 'socialone_default'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    // 1. Try creating instance first
    const createRes = await fetch(`${baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        instanceName,
        token: instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
      cache: 'no-store',
    });

    if (createRes.ok) {
      const data = await createRes.json();
      const rawQr = data?.qrcode?.base64 || data?.qrcode?.code || data?.base64 || data?.code;
      return {
        instanceName,
        status: data?.instance?.status === 'open' ? 'connected' : 'connecting',
        qrcode: formatQrCodeBase64(rawQr),
      };
    }

    // 2. If instance already exists, check status
    return await getInstanceStatus(instanceName);
  } catch (error) {
    console.warn('Evolution API create instance warning:', error);
    return {
      instanceName,
      status: 'disconnected',
    };
  }
}

/**
 * Checks connection status of an instance on the Easypanel Evolution API.
 */
export async function getInstanceStatus(instanceName: string = 'socialone_default'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers: { 'apikey': apiKey },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const state = data?.instance?.state || data?.state;

    return {
      instanceName,
      status: state === 'open' ? 'connected' : state === 'connecting' ? 'connecting' : 'disconnected',
      phone: data?.instance?.owner || data?.owner,
    };
  } catch (error) {
    return {
      instanceName,
      status: 'disconnected',
    };
  }
}

/**
 * Fetches current real QR code for pairing from Easypanel Evolution API.
 */
export async function fetchQrCode(instanceName: string = 'socialone_default'): Promise<{ qrcode?: string; status: string }> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    // Ensure instance is created first on Easypanel
    await getOrCreateInstance(instanceName);

    // Call connect endpoint on Evolution API v2
    const res = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
      headers: { 'apikey': apiKey },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawQr = data?.base64 || data?.code || data?.qrcode?.base64 || data?.qrcode?.code;
      if (rawQr) {
        return {
          qrcode: formatQrCodeBase64(rawQr),
          status: 'connecting',
        };
      }
    }
  } catch (error) {
    console.warn('Error fetching live QR code from Easypanel:', error);
  }

  // If connection fails, fetch status
  const statusInfo = await getInstanceStatus(instanceName);
  return {
    status: statusInfo.status,
    qrcode: undefined,
  };
}

/**
 * Sends a text message via WhatsApp using the Easypanel Evolution API.
 */
export async function sendWhatsAppMessage(instanceName: string = 'socialone_default', remoteJid: string, text: string) {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing',
        },
        textMessage: {
          text,
        },
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error sending message via Easypanel Evolution API:', error);
    return { error: 'Failed to send WhatsApp message' };
  }
}
