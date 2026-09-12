export interface EvolutionInstanceInfo {
  instanceName: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrcode?: string;
  pairingCode?: string;
  phone?: string;
  error?: string;
}

/**
 * Gets the Evolution API base URL.
 */
export function getEvolutionBaseUrl(): string {
  const url = process.env.EVOLUTION_API_URL || 'https://markei-evolution-api.ro91ry.easypanel.host';
  return url.replace(/\/$/, '').replace(/\/manager$/, '');
}

/**
 * Gets the Global Evolution API Key.
 */
export function getEvolutionApiKey(): string {
  return process.env.EVOLUTION_API_KEY || 'c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH';
}

/**
 * Common headers for Evolution API requests.
 */
function getHeaders(): HeadersInit {
  const apiKey = getEvolutionApiKey();
  return {
    'Content-Type': 'application/json',
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
  };
}

/**
 * Helper to ensure a base64 string is formatted properly as an image data URI.
 */
function formatQrCodeBase64(rawQr?: string): string | undefined {
  if (!rawQr) return undefined;
  if (typeof rawQr !== 'string') return undefined;
  if (rawQr.startsWith('data:image')) return rawQr;
  if (rawQr.length > 50 && !rawQr.includes('<svg')) {
    return `data:image/png;base64,${rawQr.trim()}`;
  }
  return rawQr;
}

/**
 * Tests connection & health of your Evolution API on Easypanel.
 */
export async function testVpsConnection(customUrl?: string, customKey?: string): Promise<{ online: boolean; version?: string; message: string }> {
  const rawUrl = customUrl || getEvolutionBaseUrl();
  const baseUrl = rawUrl.replace(/\/$/, '').replace(/\/manager$/, '');
  const apiKey = customKey || getEvolutionApiKey();

  try {
    const res = await fetch(`${baseUrl}/instance/fetchInstances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : 0;
      return {
        online: true,
        version: 'v2.0 (Easypanel)',
        message: `Evolution API conectada com sucesso em ${baseUrl}! ${count} instâncias encontradas no servidor.`,
      };
    } else {
      const errText = await res.text().catch(() => '');
      return {
        online: false,
        message: `Servidor alcançado em ${baseUrl}, mas respondeu com erro HTTP ${res.status}. ${errText.substring(0, 100)}`,
      };
    }
  } catch (error: any) {
    return {
      online: false,
      message: `Falha ao conectar em ${baseUrl}: ${error?.message || 'Erro de rede/CORS'}. Verifique se a URL está correta.`,
    };
  }
}

/**
 * Creates or fetches a WhatsApp instance on your Easypanel Evolution API.
 */
export async function getOrCreateInstance(instanceName: string = 'socialone_default'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    // 1. Create instance request
    const createRes = await fetch(`${baseUrl}/instance/create`, {
      method: 'POST',
      headers,
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
      const formattedQr = formatQrCodeBase64(rawQr);

      return {
        instanceName,
        status: data?.instance?.status === 'open' ? 'connected' : 'connecting',
        qrcode: formattedQr,
      };
    }

    // 2. If instance already exists, check status
    return await getInstanceStatus(instanceName);
  } catch (error: any) {
    console.error('Error in getOrCreateInstance:', error);
    return {
      instanceName,
      status: 'disconnected',
      error: error?.message || 'Erro ao conectar à Evolution API',
    };
  }
}

/**
 * Checks connection status of an instance on the Easypanel Evolution API.
 */
export async function getInstanceStatus(instanceName: string = 'socialone_default'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers,
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
  } catch (error: any) {
    return {
      instanceName,
      status: 'disconnected',
      error: error?.message,
    };
  }
}

/**
 * Fetches current real QR code for pairing from Easypanel Evolution API.
 */
export async function fetchQrCode(instanceName: string = 'socialone_default'): Promise<{ qrcode?: string; status: string; error?: string }> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    // 1. Ensure instance exists on Easypanel
    const createResult = await getOrCreateInstance(instanceName);
    if (createResult.qrcode) {
      return {
        qrcode: createResult.qrcode,
        status: createResult.status,
      };
    }

    // 2. Fetch connect QR Code
    const res = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
      headers,
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawQr = data?.base64 || data?.code || data?.qrcode?.base64 || data?.qrcode?.code;
      const formattedQr = formatQrCodeBase64(rawQr);

      if (formattedQr) {
        return {
          qrcode: formattedQr,
          status: 'connecting',
        };
      }
    }

    // 3. Fallback check status
    const statusInfo = await getInstanceStatus(instanceName);
    return {
      status: statusInfo.status,
      qrcode: statusInfo.qrcode,
      error: statusInfo.error,
    };
  } catch (error: any) {
    console.error('Error fetching live QR code from Easypanel:', error);
    return {
      status: 'disconnected',
      error: error?.message || 'Falha ao buscar QR Code da Evolution API',
    };
  }
}

/**
 * Sends a text message via WhatsApp using the Easypanel Evolution API.
 */
export async function sendWhatsAppMessage(instanceName: string = 'socialone_default', remoteJid: string, text: string) {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    const res = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers,
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
