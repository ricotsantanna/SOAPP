'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Instagram, 
  Database, 
  Settings as SettingsIcon,
  Bot,
  QrCode,
  Send,
  Upload,
  Key,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  FileText,
  Globe,
  AlertCircle
} from 'lucide-react';

export default function DashboardMasterWorkspace() {
  const [active, setActive] = useState<'whatsapp' | 'instagram' | 'knowledge' | 'settings'>('whatsapp');

  // --- WHATSAPP STATE ---
  const [waStatus, setWaStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [waMessagesCount, setWaMessagesCount] = useState(0);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Olá! Sou o atendente virtual do WhatsApp da Social One. Como posso te ajudar?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // --- INSTAGRAM STATE ---
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselTopic, setCarouselTopic] = useState('');
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [carousels, setCarousels] = useState<Array<{ id: number; title: string; slidesCount: number; date: string }>>([]);

  // --- KNOWLEDGE BASE (RAG) STATE ---
  const [knowledgeFiles, setKnowledgeFiles] = useState<Array<{ id: number; name: string; type: string; size: string }>>([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // --- SETTINGS (BYOAI) STATE ---
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom'>('openai');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [nvidiaKey, setNvidiaKey] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('https://api.groq.com/openai/v1');
  const [customModelName, setCustomModelName] = useState('llama-3.1-8b-instant');

  // Track saved key status from DB (only true after hitting save or loading initial settings)
  const [savedKeys, setSavedKeys] = useState<{
    openai: boolean;
    gemini: boolean;
    claude: boolean;
    nvidia: boolean;
    custom: boolean;
  }>({
    openai: false,
    gemini: false,
    claude: false,
    nvidia: false,
    custom: false,
  });

  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showNvidiaKey, setShowNvidiaKey] = useState(false);
  const [showCustomKey, setShowCustomKey] = useState(false);

  const [systemPrompt, setSystemPrompt] = useState(
    'Você é o assistente virtual oficial da empresa. Atenda os clientes via WhatsApp com máxima cordialidade e responda com base nos documentos da base de conhecimento.'
  );
  const [activeProviderText, setActiveProviderText] = useState('OpenAI (GPT-4o)');
  const [savedSettingsMsg, setSavedSettingsMsg] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [webhookSetupMsg, setWebhookSetupMsg] = useState<string | null>(null);
  const [settingUpWebhook, setSettingUpWebhook] = useState(false);

  // Load initial settings, files, and carousels from API on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        // First, load from localStorage (immediate, works regardless of DB)
        const localSettings = localStorage.getItem('soapp_settings');
        if (localSettings) {
          try {
            const local = JSON.parse(localSettings);
            if (local.openaiKey) setOpenaiKey(local.openaiKey);
            if (local.geminiKey) setGeminiKey(local.geminiKey);
            if (local.claudeKey) setClaudeKey(local.claudeKey);
            if (local.nvidiaKey) setNvidiaKey(local.nvidiaKey);
            if (local.customKey) setCustomKey(local.customKey);
            if (local.customBaseUrl) setCustomBaseUrl(local.customBaseUrl);
            if (local.customModelName) setCustomModelName(local.customModelName);
            if (local.systemPrompt) setSystemPrompt(local.systemPrompt);
            if (local.activeProvider) {
              setSelectedProvider(local.activeProvider);
              const textMap: Record<string, string> = {
                openai: 'OpenAI (GPT-4o)',
                gemini: 'Google Gemini (Gratuito)',
                claude: 'Anthropic Claude',
                nvidia: 'NVIDIA NIM (DeepSeek/Llama 3)',
                custom: 'Provedor Customizado / Groq'
              };
              setActiveProviderText(textMap[local.activeProvider] || 'OpenAI (GPT-4o)');
            }
            setSavedKeys({
              openai: !!local.openaiKey && !local.openaiKey.includes('xxxx'),
              gemini: !!local.geminiKey && !local.geminiKey.includes('xxxx'),
              claude: !!local.claudeKey && !local.claudeKey.includes('xxxx'),
              nvidia: !!local.nvidiaKey && !local.nvidiaKey.includes('xxxx'),
              custom: !!local.customKey && !local.customKey.includes('xxxx'),
            });
          } catch (_) {}
        }

        // Then try server (will override if DB has keys)
        const settingsRes = await fetch('/api/settings?userId=1');
        if (settingsRes.ok) {
          const sObj = await settingsRes.json();
          const sData = sObj.data || sObj;
          if (sData.openaiKey) setOpenaiKey(sData.openaiKey);
          if (sData.geminiKey) setGeminiKey(sData.geminiKey);
          if (sData.claudeKey) setClaudeKey(sData.claudeKey);
          if (sData.nvidiaKey) setNvidiaKey(sData.nvidiaKey);
          if (sData.customKey) setCustomKey(sData.customKey);
          if (sData.customBaseUrl) setCustomBaseUrl(sData.customBaseUrl);
          if (sData.customModelName) setCustomModelName(sData.customModelName);
          if (sData.systemPrompt) setSystemPrompt(sData.systemPrompt);

          setSavedKeys({
            openai: !!sData.openaiKey && !sData.openaiKey.includes('xxxx'),
            gemini: !!sData.geminiKey && !sData.geminiKey.includes('xxxx'),
            claude: !!sData.claudeKey && !sData.claudeKey.includes('xxxx'),
            nvidia: !!sData.nvidiaKey && !sData.nvidiaKey.includes('xxxx'),
            custom: !!sData.customKey && !sData.customKey.includes('xxxx'),
          });

          if (sData.activeProvider) {
            setSelectedProvider(sData.activeProvider);
            const textMap: Record<string, string> = {
              openai: 'OpenAI (GPT-4o)',
              gemini: 'Google Gemini (Gratuito)',
              claude: 'Anthropic Claude',
              nvidia: 'NVIDIA NIM (DeepSeek/Llama 3)',
              custom: 'Provedor Customizado / Groq'
            };
            setActiveProviderText(textMap[sData.activeProvider] || 'OpenAI (GPT-4o)');
          }
        }

        // Load Knowledge Base
        const kbRes = await fetch('/api/knowledge?userId=1');
        if (kbRes.ok) {
          const kbData = await kbRes.json();
          if (kbData.files && Array.isArray(kbData.files)) {
            setKnowledgeFiles(kbData.files.map((f: any) => ({
              id: f.id,
              name: f.file_name,
              type: (f.file_type || 'PDF').toUpperCase(),
              size: f.size || '1.5 MB'
            })));
          }
        }

        // Load Carousels
        const cRes = await fetch('/api/carousels?userId=1');
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.carousels && Array.isArray(cData.carousels)) {
            setCarousels(cData.carousels.map((c: any) => ({
              id: c.id,
              title: c.title,
              slidesCount: c.slides_count || 5,
              date: c.date || 'Hoje'
            })));
          }
        }

        // Load WhatsApp connection status
        const waRes = await fetch('/api/whatsapp?action=status&userId=1');
        if (waRes.ok) {
          const waData = await waRes.json();
          if (waData.status) setWaStatus(waData.status);
        }

        // Load live chat messages
        const chatRes = await fetch('/api/ai/chat?userId=1');
        if (chatRes.ok) {
          const cData = await chatRes.json();
          if (cData.messages && Array.isArray(cData.messages)) {
            setChatMessages(cData.messages.map((m: any) => ({
              sender: m.sender === 'user' ? 'user' : 'ai',
              text: m.text,
            })));
          }
        }
      } catch (err) {
        console.error('Error loading initial dashboard data:', err);
      }
    }

    loadInitialData();

    // Poll for live WhatsApp messages every 3 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/ai/chat?userId=1');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            setChatMessages(data.messages.map((m: any) => ({
              sender: m.sender === 'user' ? 'user' : 'ai',
              text: m.text,
            })));
          }
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSendWaMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Get the active API key directly from state (bypasses serverless memory limitations)
      const activeKeyMap: Record<string, string> = {
        openai: openaiKey,
        gemini: geminiKey,
        claude: claudeKey,
        nvidia: nvidiaKey,
        custom: customKey,
      };
      const activeApiKey = activeKeyMap[selectedProvider] || '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          userId: 1,
          providerPreference: selectedProvider,
          apiKey: activeApiKey,
          systemPrompt: systemPrompt,
        }),
      });
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        setChatMessages(data.messages.map((m: any) => ({
          sender: m.sender === 'user' ? 'user' : 'ai',
          text: m.text,
        })));
      } else if (data.reply) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
      setWaMessagesCount(prev => prev + 1);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Erro ao conectar ao motor de IA.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const [disconnectingWa, setDisconnectingWa] = useState(false);

  const handleFetchQr = async () => {
    setShowQrModal(true);
    setQrLoading(true);
    setQrError(null);
    try {
      const res = await fetch('/api/whatsapp?action=qrcode&userId=1', { cache: 'no-store' });
      const data = await res.json();
      if (data.qrcode) {
        setQrCodeData(data.qrcode);
      } else if (data.status === 'connected') {
        setWaStatus('connected');
        setQrCodeData(null);
        setQrError('ALREADY_CONNECTED');
      } else if (data.error) {
        setQrError(data.error);
      } else {
        setQrError('Aguardando geração do QR Code...');
      }
    } catch (error: any) {
      console.error('QR Fetch Error:', error);
      setQrError('Erro de comunicação com a Evolution API.');
    } finally {
      setQrLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm('Deseja desconectar esta instância do WhatsApp? Você precisará ler um novo QR Code para reconectar.')) return;
    setDisconnectingWa(true);
    try {
      const res = await fetch('/api/whatsapp?action=logout&userId=1');
      const data = await res.json();
      if (data.success) {
        setWaStatus('disconnected');
        setQrCodeData(null);
        setQrError(null);
        setShowQrModal(false);
        alert('WhatsApp desconectado com sucesso! Agora você pode gerar um novo QR Code.');
      } else {
        alert('Falha ao desconectar do WhatsApp: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err: any) {
      alert('Erro de rede ao desconectar: ' + err.message);
    } finally {
      setDisconnectingWa(false);
    }
  };

  const handleCreateCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselTopic.trim() || carouselLoading) return;

    setCarouselLoading(true);
    try {
      const res = await fetch('/api/carousels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, topic: carouselTopic }),
      });
      const data = await res.json();
      if (data.carousel) {
        setCarousels(prev => [
          {
            id: data.carousel.id,
            title: data.carousel.title,
            slidesCount: data.carousel.slides_count || 5,
            date: data.carousel.date || 'Hoje'
          },
          ...prev
        ]);
      }
      setCarouselTopic('');
      setShowCarouselModal(false);
    } catch (err) {
      console.error('Error creating carousel:', err);
    } finally {
      setCarouselLoading(false);
    }
  };

  const handleDeleteCarousel = async (id: number) => {
    try {
      await fetch(`/api/carousels?id=${id}&userId=1`, { method: 'DELETE' });
      setCarousels(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting carousel:', err);
    }
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('userId', '1');

      const res = await fetch('/api/knowledge', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.file) {
        setKnowledgeFiles(prev => [data.file, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDeleteKnowledgeFile = async (id: number) => {
    try {
      await fetch(`/api/knowledge?id=${id}&userId=1`, { method: 'DELETE' });
      setKnowledgeFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      // Save to localStorage FIRST — works without a database, survives page refresh
      const settingsToSave = {
        openaiKey, geminiKey, claudeKey, nvidiaKey, customKey,
        systemPrompt, activeProvider: selectedProvider, customBaseUrl, customModelName
      };
      localStorage.setItem('soapp_settings', JSON.stringify(settingsToSave));

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          openaiKey,
          geminiKey,
          claudeKey,
          nvidiaKey,
          customKey,
          systemPrompt,
          activeProvider: selectedProvider,
          customBaseUrl,
          customModelName
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSettingsMsg(data.message || data.notice || '✅ Configurações salvas com sucesso!');
        setSavedKeys({
          openai: !!openaiKey && !openaiKey.includes('xxxx'),
          gemini: !!geminiKey && !geminiKey.includes('xxxx'),
          claude: !!claudeKey && !claudeKey.includes('xxxx'),
          nvidia: !!nvidiaKey && !nvidiaKey.includes('xxxx'),
          custom: !!customKey && !customKey.includes('xxxx'),
        });
        const textMap: Record<string, string> = {
          openai: 'OpenAI (GPT-4o)',
          gemini: 'Google Gemini (Gratuito)',
          claude: 'Anthropic Claude',
          nvidia: 'NVIDIA NIM (DeepSeek/Llama 3)',
          custom: 'Provedor Customizado / Groq'
        };
        setActiveProviderText(textMap[selectedProvider] || 'OpenAI (GPT-4o)');

        // Also sync keys to Vercel env vars so WhatsApp webhook can use them
        fetch('/api/sync-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ openaiKey, geminiKey, claudeKey, nvidiaKey, customKey, activeProvider: selectedProvider }),
        }).then(syncRes => syncRes.json()).then(syncData => {
          if (syncData.success) {
            setSavedSettingsMsg(prev => (prev || '') + '\n🔗 Chaves sincronizadas com WhatsApp automaticamente!');
          }
        }).catch(() => {}); // Silently fail if Vercel API not configured
      } else {
        setSavedSettingsMsg(data.message || data.notice || '⚠️ Erro ao salvar configurações no servidor, mas salvo localmente.');
      }
      setTimeout(() => setSavedSettingsMsg(null), 7000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedSettingsMsg('⚠️ Erro ao comunicar com o servidor. Chave salva localmente.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSetupWebhook = async () => {
    setSettingUpWebhook(true);
    setWebhookSetupMsg(null);
    try {
      const res = await fetch('/api/whatsapp?action=setup-webhook&userId=1', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setWebhookSetupMsg(`✅ Webhook configurado! A IA agora responderá automaticamente no WhatsApp Business.`);
      } else {
        setWebhookSetupMsg(`⚠️ ${data.error || 'Erro ao configurar webhook. Verifique a Evolution API.'}`);
      }
    } catch (err: any) {
      setWebhookSetupMsg(`⚠️ Erro: ${err?.message || 'Falha de comunicação.'}`);
    } finally {
      setSettingUpWebhook(false);
      setTimeout(() => setWebhookSetupMsg(null), 10000);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#0B132B] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. WHATSAPP COLUMN */}
      <div 
        onClick={() => setActive('whatsapp')} 
        className={`relative transition-all duration-500 ease-in-out border-r border-slate-800/80 flex flex-col justify-between overflow-hidden ${
          active === 'whatsapp' 
            ? 'flex-[5] bg-[#0B132B] z-10 shadow-2xl border-[#86198F]/40' 
            : 'flex-[1] bg-[#090E22] hover:bg-[#0B132B] cursor-pointer'
        }`}
      >
        {active === 'whatsapp' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FACC15]" />
        )}

        {/* Column Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-colors ${
              active === 'whatsapp' 
                ? 'bg-[#581C87] text-white shadow-lg shadow-purple-950/50' 
                : 'bg-[#151D3B] text-[#FACC15]'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            {active === 'whatsapp' && (
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white">WhatsApp</h2>
                <p className="text-xs text-[#E9D5FF]">Atendimento IA & Instâncias</p>
              </div>
            )}
          </div>
          {active !== 'whatsapp' && (
            <span className="text-xs font-semibold text-[#E9D5FF]/60 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
              WhatsApp
            </span>
          )}
        </div>

        {/* Column Inner Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === 'whatsapp' && (
            <div className="space-y-6 max-w-4xl">
              {/* Top Banner Card */}
              <div className="p-6 rounded-2xl bg-[#111936] border border-[#581C87]/30 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-[#FACC15] uppercase tracking-wider mb-2">
                  Painel de Controle — WhatsApp
                </h3>
                <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                  Gerencie conexões via QR Code, visualize o status das instâncias e monitore o fluxo de atendimento automatizado.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#E9D5FF]/60">Status da Conexão</span>
                    <p className={`text-lg font-bold mt-1 flex items-center space-x-2 ${
                      waStatus === 'connected' ? 'text-emerald-400' : waStatus === 'connecting' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        waStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : waStatus === 'connecting' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'
                      }`} />
                      <span className="capitalize">{waStatus === 'connected' ? 'Conectado' : waStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}</span>
                    </p>
                  </div>
                  <button 
                    onClick={handleFetchQr}
                    className="text-xs text-[#FACC15] hover:underline font-semibold"
                  >
                    Ver QR Code
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Mensagens hoje</span>
                  <p className="text-lg font-bold text-[#FACC15] mt-1">{waMessagesCount.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Button & Live Simulator Box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleFetchQr}
                    className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10 flex items-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Gerenciar Instância</span>
                  </button>

                  <span className="text-xs text-[#E9D5FF]/70 font-mono">Easypanel Host</span>
                </div>

                {/* Live Chat Box */}
                <div className="p-4 rounded-2xl bg-[#090E22] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Bot className="w-4 h-4 text-[#FACC15]" />
                      <span>Atendimento ao Vivo — Chat do WhatsApp</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">EM TEMPO REAL</span>
                  </div>

                  <div className="h-44 overflow-y-auto space-y-2 text-xs pr-1">
                    {chatMessages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2.5 rounded-xl ${
                          m.sender === 'user' ? 'bg-[#581C87] text-white' : 'bg-[#111936] text-slate-200 border border-slate-800'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-[11px] text-[#FACC15] flex items-center space-x-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>IA digitando resposta...</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendWaMessage} className="flex items-center space-x-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Enviar mensagem pelo WhatsApp..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#581C87]"
                    />
                    <button type="submit" disabled={chatLoading} className="p-2 rounded-xl bg-[#FACC15] text-slate-950 font-bold hover:bg-[#FDE047]">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070B1B] border-t border-slate-800/40 text-center shrink-0">
          <span className="text-[10px] text-[#E9D5FF]/50 uppercase tracking-widest font-mono">socialoneapp.com.br</span>
        </div>
      </div>


      {/* 2. INSTAGRAM COLUMN */}
      <div 
        onClick={() => setActive('instagram')} 
        className={`relative transition-all duration-500 ease-in-out border-r border-slate-800/80 flex flex-col justify-between overflow-hidden ${
          active === 'instagram' 
            ? 'flex-[5] bg-[#0B132B] z-10 shadow-2xl border-[#86198F]/40' 
            : 'flex-[1] bg-[#090E22] hover:bg-[#0B132B] cursor-pointer'
        }`}
      >
        {active === 'instagram' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FACC15]" />
        )}

        {/* Column Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-colors ${
              active === 'instagram' 
                ? 'bg-[#86198F] text-white shadow-lg shadow-magenta-950/50' 
                : 'bg-[#151D3B] text-[#FACC15]'
            }`}>
              <Instagram className="w-5 h-5" />
            </div>
            {active === 'instagram' && (
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white">Instagram</h2>
                <p className="text-xs text-[#E9D5FF]">Automação & Carrosséis</p>
              </div>
            )}
          </div>
          {active !== 'instagram' && (
            <span className="text-xs font-semibold text-[#E9D5FF]/60 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
              Instagram
            </span>
          )}
        </div>

        {/* Column Inner Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === 'instagram' && (
            <div className="space-y-6 max-w-4xl">
              {/* Top Banner Card */}
              <div className="p-6 rounded-2xl bg-[#111936] border border-[#86198F]/30 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-[#FACC15] uppercase tracking-wider mb-2">
                  Painel de Criação — Carrosséis IA
                </h3>
                <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                  Gere conteúdos estruturados em slides com base nos dados da empresa e aprove rascunhos antes da publicação.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Posts Pendentes</span>
                  <p className="text-lg font-bold text-[#FACC15] mt-1">{carousels.length} Rascunhos</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Publicados no Mês</span>
                  <p className="text-lg font-bold text-[#E9D5FF] mt-1">14 Posts</p>
                </div>
              </div>

              {/* Carousels List */}
              <div className="space-y-4">
                <button 
                  onClick={() => setShowCarouselModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Novo Carrossel</span>
                </button>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rascunhos Recentes de Carrossel</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {carousels.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-[#111936] border border-slate-800 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-white truncate max-w-[200px]">{c.title}</h5>
                          <span className="text-xs text-[#E9D5FF]/60">{c.slidesCount} Slides • {c.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#86198F]/20 text-[#E9D5FF] border border-[#86198F]/40">
                            PRONTO
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteCarousel(c.id); }}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070B1B] border-t border-slate-800/40 text-center shrink-0">
          <span className="text-[10px] text-[#E9D5FF]/50 uppercase tracking-widest font-mono">socialoneapp.com.br</span>
        </div>
      </div>


      {/* 3. BASE DE CONHECIMENTO COLUMN */}
      <div 
        onClick={() => setActive('knowledge')} 
        className={`relative transition-all duration-500 ease-in-out border-r border-slate-800/80 flex flex-col justify-between overflow-hidden ${
          active === 'knowledge' 
            ? 'flex-[5] bg-[#0B132B] z-10 shadow-2xl border-[#86198F]/40' 
            : 'flex-[1] bg-[#090E22] hover:bg-[#0B132B] cursor-pointer'
        }`}
      >
        {active === 'knowledge' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FACC15]" />
        )}

        {/* Column Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-colors ${
              active === 'knowledge' 
                ? 'bg-[#581C87] text-white shadow-lg shadow-purple-950/50' 
                : 'bg-[#151D3B] text-[#FACC15]'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            {active === 'knowledge' && (
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white">Base de Conhecimento</h2>
                <p className="text-xs text-[#E9D5FF]">PDFs & Google Drive (RAG)</p>
              </div>
            )}
          </div>
          {active !== 'knowledge' && (
            <span className="text-xs font-semibold text-[#E9D5FF]/60 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
              Base de Dados
            </span>
          )}
        </div>

        {/* Column Inner Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === 'knowledge' && (
            <div className="space-y-6 max-w-4xl">
              {/* Top Banner Card */}
              <div className="p-6 rounded-2xl bg-[#111936] border border-[#581C87]/30 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-[#FACC15] uppercase tracking-wider mb-2">
                  Repositório de Conhecimento
                </h3>
                <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                  Faça upload de manuais em PDF ou conecte o Google Drive para alimentar as respostas da inteligência artificial.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Arquivos Indexados</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">{knowledgeFiles.length} Documentos</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Sincronização</span>
                  <p className="text-lg font-bold text-[#FACC15] mt-1">Automática</p>
                </div>
              </div>

              {/* Upload & Files list */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <label className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10 flex items-center space-x-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingPdf ? 'Processando PDF...' : 'Enviar Novo PDF'}</span>
                    <input type="file" accept=".pdf" onChange={handleUploadPdf} className="hidden" disabled={uploadingPdf} />
                  </label>

                  <a 
                    href="/api/drive"
                    className="px-4 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2"
                  >
                    <Globe className="w-4 h-4 text-[#FACC15]" />
                    <span>Conectar Google Drive</span>
                  </a>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documentos Ativos (RAG Context)</h4>
                  <div className="space-y-2">
                    {knowledgeFiles.map(f => (
                      <div key={f.id} className="p-3 rounded-xl bg-[#111936] border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-[#581C87]" />
                          <div>
                            <div className="font-bold text-xs text-white">{f.name}</div>
                            <div className="text-[10px] text-slate-400">{f.size} • Indexado</div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteKnowledgeFile(f.id); }}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070B1B] border-t border-slate-800/40 text-center shrink-0">
          <span className="text-[10px] text-[#E9D5FF]/50 uppercase tracking-widest font-mono">socialoneapp.com.br</span>
        </div>
      </div>


      {/* 4. CONFIGURAÇÕES COLUMN */}
      <div 
        onClick={() => setActive('settings')} 
        className={`relative transition-all duration-500 ease-in-out flex flex-col justify-between overflow-hidden ${
          active === 'settings' 
            ? 'flex-[5] bg-[#0B132B] z-10 shadow-2xl border-[#86198F]/40' 
            : 'flex-[1] bg-[#090E22] hover:bg-[#0B132B] cursor-pointer'
        }`}
      >
        {active === 'settings' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FACC15]" />
        )}

        {/* Column Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-colors ${
              active === 'settings' 
                ? 'bg-[#86198F] text-white shadow-lg shadow-magenta-950/50' 
                : 'bg-[#151D3B] text-[#FACC15]'
            }`}>
              <SettingsIcon className="w-5 h-5" />
            </div>
            {active === 'settings' && (
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white">Configurações</h2>
                <p className="text-xs text-[#E9D5FF]">BYOAI & System Prompt</p>
              </div>
            )}
          </div>
          {active !== 'settings' && (
            <span className="text-xs font-semibold text-[#E9D5FF]/60 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
              Ajustes
            </span>
          )}
        </div>

        {/* Column Inner Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              {/* Top Banner Card */}
              <div className="p-6 rounded-2xl bg-[#111936] border border-[#86198F]/30 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-[#FACC15] uppercase tracking-wider mb-2">
                  Chaves de IA e Personas
                </h3>
                <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                  Configure sua chave de API (OpenAI/Gemini) e defina o comportamento e tom de voz da inteligência artificial.
                </p>
              </div>

              {/* Status das Chaves Cadastradas */}
              <div className="p-4.5 rounded-2xl bg-[#111936] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status das Suas Chaves de IA Cadastradas</h4>
                  <span className="text-[10px] text-[#FACC15] font-semibold">Clique para editar uma chave</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {/* OpenAI Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('openai');
                      setActiveProviderText('OpenAI (GPT-4o)');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      savedKeys.openai
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    } ${selectedProvider === 'openai' ? 'ring-2 ring-[#86198F]' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span>OpenAI</span>
                    </div>
                    {savedKeys.openai ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ativa</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Pendente</span>
                    )}
                  </button>

                  {/* Gemini Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('gemini');
                      setActiveProviderText('Google Gemini (Gratuito)');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      savedKeys.gemini
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    } ${selectedProvider === 'gemini' ? 'ring-2 ring-[#86198F]' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Google Gemini</span>
                    </div>
                    {savedKeys.gemini ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ativa</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Pendente</span>
                    )}
                  </button>

                  {/* NVIDIA NIM Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('nvidia');
                      setActiveProviderText('NVIDIA NIM (DeepSeek/Llama 3)');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      savedKeys.nvidia
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    } ${selectedProvider === 'nvidia' ? 'ring-2 ring-[#86198F]' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-green-400" />
                      <span>NVIDIA NIM</span>
                    </div>
                    {savedKeys.nvidia ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ativa</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Pendente</span>
                    )}
                  </button>

                  {/* Anthropic Claude Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('claude');
                      setActiveProviderText('Anthropic Claude');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      savedKeys.claude
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    } ${selectedProvider === 'claude' ? 'ring-2 ring-[#86198F]' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                      <span>Claude</span>
                    </div>
                    {savedKeys.claude ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ativa</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Pendente</span>
                    )}
                  </button>

                  {/* Custom Provider Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('custom');
                      setActiveProviderText('Provedor Customizado / Groq');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      savedKeys.custom
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    } ${selectedProvider === 'custom' ? 'ring-2 ring-[#86198F]' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Custom / Groq</span>
                    </div>
                    {savedKeys.custom ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ativa</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Pendente</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Settings Form */}
              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* 1. Dropdown Provider Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Selecione o Provedor de IA</span>
                    <span className="text-[10px] text-[#FACC15] font-semibold">BYOAI — Traga Sua Própria IA</span>
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setSelectedProvider(val);
                      const textMap: Record<string, string> = {
                        openai: 'OpenAI (GPT-4o)',
                        gemini: 'Google Gemini (Gratuito)',
                        claude: 'Anthropic Claude',
                        nvidia: 'NVIDIA NIM (DeepSeek/Llama 3)',
                        custom: 'Provedor Customizado / Groq'
                      };
                      setActiveProviderText(textMap[val] || 'OpenAI (GPT-4o)');
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#111936] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-[#86198F] cursor-pointer"
                  >
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                    <option value="gemini">Google Gemini (100% GRATUITO — 1.500 requisições/dia)</option>
                    <option value="nvidia">NVIDIA NIM (10.000 CRÉDITOS GRÁTIS — DeepSeek-R1 / Llama 3.3)</option>
                    <option value="claude">Anthropic Claude (Sonnet 3.5 / Haiku)</option>
                    <option value="custom">Provedor Customizado / OpenAI Compatível (Groq, DeepSeek, Ollama)</option>
                  </select>
                </div>

                {/* 2. DYNAMIC SINGLE API KEY FIELD BASED ON DROPDOWN SELECTION */}
                {selectedProvider === 'openai' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Chave de API OpenAI
                    </label>
                    <div className="relative">
                      <input 
                        type={showOpenaiKey ? 'text' : 'password'}
                        value={openaiKey}
                        onChange={e => setOpenaiKey(e.target.value)}
                        placeholder="Cole sua chave OpenAI aqui (ex: sk-proj-...)"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                      />
                      <button type="button" onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      💡 <strong>OpenAI GPT-4o:</strong> Cole sua chave obtida em <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-[#FACC15] hover:underline font-medium">platform.openai.com/api-keys</a>.
                    </p>
                  </div>
                )}

                {selectedProvider === 'gemini' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center space-x-2">
                      <span>Chave de API Google Gemini</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">100% GRATUITO</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showGeminiKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={e => setGeminiKey(e.target.value)}
                        placeholder="Cole sua chave Gemini aqui (ex: AIzaSy...)"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                      />
                      <button type="button" onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      🎁 <strong>Gratuito sem cartão de crédito:</strong> Crie sua chave com limite de 1.500 req/dia em <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#FACC15] hover:underline font-medium">aistudio.google.com</a>.
                    </p>
                  </div>
                )}

                {selectedProvider === 'nvidia' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center space-x-2">
                      <span>Chave de API NVIDIA NIM</span>
                      <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded font-bold">10.000 CRÉDITOS GRÁTIS</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showNvidiaKey ? 'text' : 'password'}
                        value={nvidiaKey}
                        onChange={e => setNvidiaKey(e.target.value)}
                        placeholder="Cole sua chave NVIDIA NIM aqui (ex: nvapi-...)"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                      />
                      <button type="button" onClick={() => setShowNvidiaKey(!showNvidiaKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showNvidiaKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      🚀 <strong>NVIDIA NIM:</strong> Roda DeepSeek-R1 e Llama 3.3 70B ultra-rápidos. Ganhe 10.000 créditos grátis em <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-[#FACC15] hover:underline font-medium">build.nvidia.com</a>.
                    </p>
                  </div>
                )}

                {selectedProvider === 'claude' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Chave de API Anthropic Claude
                    </label>
                    <div className="relative">
                      <input 
                        type={showClaudeKey ? 'text' : 'password'}
                        value={claudeKey}
                        onChange={e => setClaudeKey(e.target.value)}
                        placeholder="Cole sua chave Anthropic Claude aqui (ex: sk-ant-...)"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                      />
                      <button type="button" onClick={() => setShowClaudeKey(!showClaudeKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      🧠 <strong>Anthropic Claude 3.5 Sonnet:</strong> Obtenha sua chave em <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-[#FACC15] hover:underline font-medium">console.anthropic.com</a>.
                    </p>
                  </div>
                )}

                {selectedProvider === 'custom' && (
                  <div className="p-4 rounded-2xl bg-[#090E22] border border-cyan-900/40 space-y-3">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Provedor Customizado / OpenAI Compatível (Groq, DeepSeek, Ollama)</span>
                    </h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Endpoint Base (Base URL)</label>
                      <input 
                        type="text"
                        value={customBaseUrl}
                        onChange={e => setCustomBaseUrl(e.target.value)}
                        placeholder="https://api.groq.com/openai/v1 ou http://localhost:11434/v1"
                        className="w-full px-3 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Nome do Modelo</label>
                      <input 
                        type="text"
                        value={customModelName}
                        onChange={e => setCustomModelName(e.target.value)}
                        placeholder="ex: llama-3.1-8b-instant, deepseek-coder, etc."
                        className="w-full px-3 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Chave de API (Se exigido)</label>
                      <div className="relative">
                        <input 
                          type={showCustomKey ? 'text' : 'password'}
                          value={customKey}
                          onChange={e => setCustomKey(e.target.value)}
                          placeholder="gsk_... ou chave do provedor"
                          className="w-full px-3 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 pr-10"
                        />
                        <button type="button" onClick={() => setShowCustomKey(!showCustomKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showCustomKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Prompt / Persona */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">System Prompt / Persona do Negócio</label>
                  <textarea 
                    rows={4}
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] leading-relaxed"
                  />
                </div>

                {/* Save Button */}
                <button 
                  type="submit"
                  disabled={savingSettings}
                  className="w-full py-3.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {savingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Testando e Salvando Chave...</span>
                    </>
                  ) : (
                    <span>Salvar Configurações & Testar Chave</span>
                  )}
                </button>

                {/* Confirmation Feedback Box — Positioned RIGHT BELOW the Save Button */}
                {savedSettingsMsg && (
                  <div className={`p-4 rounded-xl border text-xs flex items-start space-x-2.5 leading-relaxed animate-fadeIn mt-3 ${
                    savedSettingsMsg.startsWith('⚠️')
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{savedSettingsMsg}</span>
                  </div>
                )}
              </form>

              {/* WhatsApp Webhook Integration Card */}
              <div className="p-4 rounded-2xl bg-[#090E22] border border-[#FACC15]/20 space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-[#FACC15]" />
                  <h4 className="text-xs font-bold text-slate-200">Ativar IA no WhatsApp Business</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Após salvar sua chave de IA, clique no botão abaixo para configurar automaticamente o webhook na sua Evolution API e ativar as respostas automáticas no WhatsApp Business.
                </p>
                <button
                  type="button"
                  onClick={handleSetupWebhook}
                  disabled={settingUpWebhook}
                  className="w-full py-3 rounded-xl bg-[#581C87] text-white font-bold text-xs hover:bg-[#6D28D9] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {settingUpWebhook ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Configurando Webhook...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Ativar IA no WhatsApp Business (Configurar Webhook)</span>
                    </>
                  )}
                </button>
                {webhookSetupMsg && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2 leading-relaxed ${
                    webhookSetupMsg.startsWith('⚠️')
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{webhookSetupMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070B1B] border-t border-slate-800/40 text-center shrink-0">
          <span className="text-[10px] text-[#E9D5FF]/50 uppercase tracking-widest font-mono">socialoneapp.com.br</span>
        </div>
      </div>

      {/* MODAL: QR CODE PAIRING */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111936] border border-[#581C87]/40 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 relative shadow-2xl">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="font-bold text-white text-base">Pareamento WhatsApp Business</h3>
            <p className="text-xs text-slate-400">Conexão com a Evolution API no Easypanel</p>
            
            <div className="w-56 h-56 bg-slate-950 mx-auto rounded-2xl border border-slate-800 p-2 flex items-center justify-center relative overflow-hidden">
              {qrLoading ? (
                <div className="flex flex-col items-center space-y-2 text-[#FACC15]">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-semibold">Buscando QR Code...</span>
                </div>
              ) : qrCodeData ? (
                <img src={qrCodeData} alt="QR Code WhatsApp" className="w-full h-full object-contain rounded-lg" />
              ) : qrError === 'ALREADY_CONNECTED' || waStatus === 'connected' ? (
                <div className="p-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-emerald-400">WhatsApp Conectado!</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">Sua instância do WhatsApp já está emparelhada e pronta para uso.</div>
                </div>
              ) : (
                <div className="p-4 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-[#FACC15] mx-auto" />
                  <div className="text-xs text-slate-300">{qrError || 'Aguardando geração do QR Code...'}</div>
                  <button onClick={handleFetchQr} className="text-xs font-bold text-[#FACC15] hover:underline">
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>

            {qrError === 'ALREADY_CONNECTED' || waStatus === 'connected' ? (
              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleDisconnectWhatsApp} 
                  disabled={disconnectingWa}
                  className="w-full py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  {disconnectingWa ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Desconectar Instância WhatsApp</span>}
                </button>
                <button onClick={() => setShowQrModal(false)} className="w-full py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700">
                  Manter Conectado (Fechar)
                </button>
              </div>
            ) : (
              <button onClick={() => setShowQrModal(false)} className="w-full py-2.5 bg-[#FACC15] text-slate-950 font-bold rounded-xl text-xs hover:bg-[#FDE047]">
                Concluído
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL: NEW CAROUSEL */}
      {showCarouselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#111936] border border-[#86198F]/40 p-6 rounded-3xl max-w-md w-full space-y-4 relative">
            <button onClick={() => setShowCarouselModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="font-bold text-white text-base">Gerar Novo Carrossel por IA</h3>
            <p className="text-xs text-slate-400">Digite o tema ou objetivo do post para gerar slides com base nos dados da sua empresa</p>
            <form onSubmit={handleCreateCarousel} className="space-y-4">
              <input 
                type="text"
                required
                value={carouselTopic}
                onChange={e => setCarouselTopic(e.target.value)}
                placeholder="Ex: 5 erros comuns no atendimento via WhatsApp"
                className="w-full px-3 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#86198F]"
              />
              <button 
                type="submit"
                disabled={carouselLoading}
                className="w-full py-3 bg-[#FACC15] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{carouselLoading ? 'Gerando Carrossel...' : 'Gerar Carrossel com IA'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
