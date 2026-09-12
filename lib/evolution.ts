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
 */
export function getEvolutionApiKey(): string {
  return process.env.EVOLUTION_API_KEY || 'socialone_global_apikey';
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
    });

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        version: 'v2.0 (Easypanel)',
        message: `Evolution API conectada com sucesso em ${baseUrl}! ${Array.isArray(data) ? data.length : 0} instâncias encontradas.`,
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
      message: `Não foi possível alcançar a Evolution API em ${baseUrl}. Verifique a URL e se o serviço está online no Easypanel.`,
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
export async function getOrCreateInstance(instanceName: string): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/create`, {
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
    });

    if (res.ok) {
      const data = await res.json();
      return {
        instanceName,
        status: data?.instance?.status === 'open' ? 'connected' : 'connecting',
        qrcode: data?.qrcode?.base64 || data?.qrcode?.code,
      };
    }

    return await getInstanceStatus(instanceName);
  } catch (error) {
    console.warn('Evolution API offline or in fallback mode:', error);
    return {
      instanceName,
      status: 'disconnected',
    };
  }
}

/**
 * Checks connection status of an instance on the Easypanel Evolution API.
 */
export async function getInstanceStatus(instanceName: string): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers: { 'apikey': apiKey },
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
 * Fetches current QR code for pairing from Easypanel Evolution API.
 */
export async function fetchQrCode(instanceName: string): Promise<{ qrcode?: string; status: string }> {
  const baseUrl = getEvolutionBaseUrl();
  const apiKey = getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
      headers: { 'apikey': apiKey },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        qrcode: data?.base64 || data?.code || data?.qrcode?.base64,
        status: 'connecting',
      };
    }
  } catch (error) {
    console.warn('QR Code fetch error:', error);
  }

  // Fallback SVG QR Code preview
  return {
    status: 'connecting',
    qrcode: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" fill="none"><rect width="220" height="220" fill="%230F172A" rx="16"/><rect x="20" y="20" width="60" height="60" fill="%237C3AED"/><rect x="30" y="30" width="40" height="40" fill="%230F172A"/><rect x="40" y="40" width="20" height="20" fill="%23FACC15"/><rect x="140" y="20" width="60" height="60" fill="%237C3AED"/><rect x="150" y="30" width="40" height="40" fill="%230F172A"/><rect x="160" y="40" width="20" height="20" fill="%23FACC15"/><rect x="20" y="140" width="60" height="60" fill="%237C3AED"/><rect x="30" y="150" width="40" height="40" fill="%230F172A"/><rect x="40" y="160" width="20" height="20" fill="%23FACC15"/><rect x="100" y="30" width="20" height="30" fill="%23E9D5FF"/><rect x="100" y="80" width="30" height="20" fill="%239333EA"/><rect x="140" y="120" width="40" height="40" fill="%23FACC15"/><rect x="100" y="150" width="20" height="40" fill="%237C3AED"/><text x="110" y="205" fill="%23E9D5FF" font-size="10" text-anchor="middle" font-family="sans-serif">Easypanel Evolution QR Code</text></svg>`,
  };
}

/**
 * Sends a text message via WhatsApp using the Easypanel Evolution API.
 */
export async function sendWhatsAppMessage(instanceName: string, remoteJid: string, text: string) {
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
