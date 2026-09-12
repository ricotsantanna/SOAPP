import { NextResponse } from 'next/server';
import { encryptApiKey, decryptApiKey } from '@/lib/encryption';

/**
 * POST /api/sync-keys
 * Called by the settings page after saving, to synchronize API keys
 * to Vercel environment variables (via Vercel API).
 * This allows the WhatsApp webhook to access them without a database.
 * 
 * Requires in Vercel Dashboard:
 * - VERCEL_TOKEN: Your Vercel personal access token
 * - VERCEL_PROJECT_ID: Found in Project Settings > General
 * - VERCEL_TEAM_ID: (optional) For team projects
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { openaiKey, geminiKey, claudeKey, nvidiaKey, customKey, activeProvider } = body;

    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      // Vercel API not configured — this is optional, gracefully skip
      return NextResponse.json({ 
        success: false, 
        skipped: true,
        message: 'Variáveis de sincronização (VERCEL_TOKEN, VERCEL_PROJECT_ID) não configuradas. As chaves estão salvas localmente no navegador e funcionarão na interface web. Para ativar o WhatsApp, adicione OPENAI_API_KEY nas variáveis de ambiente do Vercel manualmente.' 
      });
    }

    const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : '';
    const apiBase = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env${teamParam}`;

    const headers = {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const keyEnvMap: Record<string, string | undefined> = {
      OPENAI_API_KEY: openaiKey,
      GEMINI_API_KEY: geminiKey,
      CLAUDE_API_KEY: claudeKey,
      NVIDIA_API_KEY: nvidiaKey,
      CUSTOM_API_KEY: customKey,
    };

    const results: Record<string, string> = {};

    for (const [envName, keyValue] of Object.entries(keyEnvMap)) {
      if (!keyValue || !keyValue.trim() || keyValue.includes('xxxx') || keyValue.length < 5) continue;

      const cleanKey = keyValue.trim().replace(/^["']|["']$/g, '');

      // Check if env var already exists
      const existRes = await fetch(`${apiBase}`, { headers });
      const existData = await existRes.json().catch(() => ({ envs: [] }));
      const existing = (existData.envs || []).find((e: any) => e.key === envName);

      if (existing) {
        // Update existing
        const updateRes = await fetch(`${apiBase}/${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ value: cleanKey, target: ['production', 'preview', 'development'] }),
        });
        results[envName] = updateRes.ok ? 'updated' : `error ${updateRes.status}`;
      } else {
        // Create new
        const createRes = await fetch(apiBase, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            key: envName, 
            value: cleanKey, 
            type: 'sensitive',
            target: ['production', 'preview', 'development'] 
          }),
        });
        results[envName] = createRes.ok ? 'created' : `error ${createRes.status}`;
      }
    }

    // Also set the active provider preference
    if (activeProvider) {
      const existRes = await fetch(`${apiBase}`, { headers });
      const existData = await existRes.json().catch(() => ({ envs: [] }));
      const existingProvider = (existData.envs || []).find((e: any) => e.key === 'AI_ACTIVE_PROVIDER');

      if (existingProvider) {
        await fetch(`${apiBase}/${existingProvider.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ value: activeProvider }),
        });
      } else {
        await fetch(apiBase, {
          method: 'POST',
          headers,
          body: JSON.stringify({ key: 'AI_ACTIVE_PROVIDER', value: activeProvider, type: 'plain', target: ['production', 'preview', 'development'] }),
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: '✅ Chaves sincronizadas com o Vercel! O WhatsApp Business usará a nova chave após o próximo deploy ou reinicialização.',
      results
    });
  } catch (error: any) {
    console.error('Error syncing env vars to Vercel:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Erro ao sincronizar com Vercel API'
    }, { status: 500 });
  }
}
