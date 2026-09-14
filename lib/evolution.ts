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
export async function getOrCreateInstance(instanceName: string = 'socialone_inst'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    // 1. First check if instance is already open / connected
    const existingStatus = await getInstanceStatus(instanceName);
    if (existingStatus.status === 'connected') {
      return existingStatus;
    }

    // 2. Create instance request
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
      const isOpened = data?.instance?.status === 'open' || data?.instance?.state === 'open' || data?.status === 'open';

      return {
        instanceName,
        status: isOpened ? 'connected' : 'connecting',
        qrcode: formattedQr,
      };
    }

    // 3. If instance already exists, check status
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
 * Uses smart fallback to fetchInstances if instance name mismatch or 404 occurs.
 */
export async function getInstanceStatus(instanceName: string = 'socialone_inst'): Promise<EvolutionInstanceInfo> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    // 1. Direct connectionState query
    const res = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      headers,
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const state = data?.instance?.state || data?.state || data?.connectionStatus || data?.instance?.connectionStatus || '';
      const stateStr = String(state).toLowerCase();
      const isConnected = stateStr === 'open' || stateStr === 'connected';
      const isConnecting = stateStr === 'connecting' || stateStr === 'qrcode' || stateStr === 'pairing';
      const phone = data?.instance?.ownerJid || data?.ownerJid || data?.instance?.owner || data?.owner || data?.number || '';

      return {
        instanceName,
        status: isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected',
        phone: phone ? String(phone).replace('@s.whatsapp.net', '') : undefined,
      };
    }

    // 2. Fallback: If 404 or instance name mismatch, fetch all instances from Evolution API
    const allRes = await fetch(`${baseUrl}/instance/fetchInstances`, { headers, cache: 'no-store' });
    if (allRes.ok) {
      const allData = await allRes.json();
      if (Array.isArray(allData)) {
        // Look for matching instance or any open instance
        const match = allData.find((i: any) => (i.name || i.instanceName) === instanceName) ||
                      allData.find((i: any) => i.connectionStatus === 'open' || i.state === 'open');

        if (match) {
          const matchName = match.name || match.instanceName || instanceName;
          const matchStatus = String(match.connectionStatus || match.state || '').toLowerCase();
          const isConn = matchStatus === 'open' || matchStatus === 'connected';
          const isConnIng = matchStatus === 'connecting' || matchStatus === 'qrcode';
          const matchPhone = match.ownerJid || match.number || match.owner || '';

          return {
            instanceName: matchName,
            status: isConn ? 'connected' : isConnIng ? 'connecting' : 'disconnected',
            phone: matchPhone ? String(matchPhone).replace('@s.whatsapp.net', '') : undefined,
          };
        }
      }
    }

    return {
      instanceName,
      status: 'disconnected',
      error: `HTTP ${res.status}`,
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
export async function fetchQrCode(instanceName: string = 'socialone_inst'): Promise<{ qrcode?: string; status: string; error?: string }> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    // 1. Check status first — if already connected, don't generate new QR code
    const statusInfo = await getInstanceStatus(instanceName);
    if (statusInfo.status === 'connected') {
      return {
        status: 'connected',
        qrcode: undefined,
      };
    }

    // 2. Ensure instance exists on Easypanel
    const createResult = await getOrCreateInstance(instanceName);
    if (createResult.status === 'connected') {
      return { status: 'connected' };
    }
    if (createResult.qrcode) {
      return {
        qrcode: createResult.qrcode,
        status: createResult.status,
      };
    }

    // 3. Fetch connect QR Code
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

    // 4. Fallback check status
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
 * Logs out and disconnects a WhatsApp instance on Evolution API.
 */
export async function logoutInstance(instanceName: string = 'socialone_inst'): Promise<{ success: boolean; error?: string }> {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();

  try {
    const res = await fetch(`${baseUrl}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) return { success: true };
    
    // Fallback: try DELETE /instance/delete
    const delRes = await fetch(`${baseUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers,
    });
    return { success: delRes.ok };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erro ao desconectar instância' };
  }
}

/**
 * Sends a text message via WhatsApp using the Easypanel Evolution API.
 */
export async function sendWhatsAppMessage(instanceName: string = 'socialone_inst', remoteJid: string, text: string) {
  const baseUrl = getEvolutionBaseUrl();
  const headers = getHeaders();
  const cleanNumber = remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');

  try {
    const res = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        number: cleanNumber,
        text: text,
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
