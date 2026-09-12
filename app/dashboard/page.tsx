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
  AlertCircle,
  Calendar,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Check
} from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import UpgradeModal from './UpgradeModal';

const WhatsAppBrandIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.854 0-3.603-.498-5.118-1.367l-.367-.213-3.804.997 1.015-3.707-.234-.372a9.78 9.78 0 01-1.503-5.263c0-5.414 4.406-9.82 9.821-9.82 2.624 0 5.09 1.023 6.944 2.878a9.776 9.776 0 012.874 6.942c0 5.415-4.407 9.826-9.828 9.826m8.376-18.201A11.725 11.725 0 0012.051 0C5.411 0 .008 5.403.008 12.043c0 2.12.553 4.19 1.604 6.012L0 24l6.104-1.601A11.776 11.776 0 0012.05 24c6.638 0 12.041-5.403 12.041-12.043 0-3.217-1.253-6.242-3.515-8.513" />
  </svg>
);

const InstagramBrandIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function DashboardMasterWorkspace() {
  const [active, setActive] = useState<'whatsapp' | 'instagram' | 'knowledge' | 'settings'>('whatsapp');
  const [businessModel, setBusinessModel] = useState<'service' | 'retail' | null>(null);
  const [userPlan, setUserPlan] = useState<'start' | 'agenda' | 'social' | 'max'>('start');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // --- WHATSAPP STATE ---
  const [waStatus, setWaStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [waMessagesCount, setWaMessagesCount] = useState(0);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const [botPaused, setBotPaused] = useState(false);
  const [botPausedUntil, setBotPausedUntil] = useState<string | null>(null);
  const [pausingBot, setPausingBot] = useState(false);
  // --- APPOINTMENTS STATE ---
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [newApptModal, setNewApptModal] = useState(false);
  const [apptCustomerName, setApptCustomerName] = useState('');
  const [apptCustomerPhone, setApptCustomerPhone] = useState('');
  const [apptServiceName, setApptServiceName] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [creatingAppt, setCreatingAppt] = useState(false);
  const [cronTriggerMsg, setCronTriggerMsg] = useState<string | null>(null);
  const [triggeringCron, setTriggeringCron] = useState(false);

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
        // Load User Profile & Business Model
        const profRes = await fetch('/api/user/profile?userId=1');
        if (profRes.ok) {
          const profData = await profRes.json();
          if (profData.profile?.business_model) {
            setBusinessModel(profData.profile.business_model);
          } else {
            setShowOnboarding(true);
          }
          if (profData.profile?.plan) {
            setUserPlan(profData.profile.plan);
          }
        } else {
          setShowOnboarding(true);
        }

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

        // Load Bot Pause / Human Handoff status
        const pauseRes = await fetch('/api/whatsapp/pause-bot?userId=1');
        if (pauseRes.ok) {
          const pData = await pauseRes.json();
          setBotPaused(pData.isPaused);
          setBotPausedUntil(pData.pausedUntil);
        }

        // Load Appointments
        const apptRes = await fetch('/api/appointments?userId=1');
        if (apptRes.ok) {
          const aData = await apptRes.json();
          if (aData.appointments && Array.isArray(aData.appointments)) {
            setAppointmentsList(aData.appointments);
          }
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

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptCustomerName || !apptCustomerPhone || !apptServiceName || !apptTime) return;
    setCreatingAppt(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          customerName: apptCustomerName,
          customerPhone: apptCustomerPhone,
          serviceName: apptServiceName,
          appointmentTime: apptTime,
        }),
      });
      const data = await res.json();
      if (data.appointment) {
        setAppointmentsList(prev => [...prev, data.appointment]);
        setNewApptModal(false);
        setApptCustomerName('');
        setApptCustomerPhone('');
        setApptServiceName('');
        setApptTime('');
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
    } finally {
      setCreatingAppt(false);
    }
  };

  const handleRun24hCron = async () => {
    setTriggeringCron(true);
    setCronTriggerMsg(null);
    try {
      const res = await fetch('/api/cron/confirmations');
      const data = await res.json();
      setCronTriggerMsg(data.message || 'Cron de confirmação executado!');
    } catch (err: any) {
      setCronTriggerMsg('Erro ao executar cron de confirmação.');
    } finally {
      setTriggeringCron(false);
      setTimeout(() => setCronTriggerMsg(null), 8000);
    }
  };

  const handleTogglePauseBot = async (durationHours: number | null) => {
    setPausingBot(true);
    try {
      const res = await fetch('/api/whatsapp/pause-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, instanceName: 'socialone_admin', durationHours }),
      });
      const data = await res.json();
      if (data.success) {
        setBotPaused(!!data.pausedUntil);
        setBotPausedUntil(data.pausedUntil);
      }
    } catch (err) {
      console.error('Error toggling bot pause:', err);
    } finally {
      setPausingBot(false);
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

  const handleSelectPlan = async (plan: 'start' | 'agenda' | 'social' | 'max') => {
    setUserPlan(plan);
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, plan }),
      });
    } catch (err) {
      console.error('Error updating user plan:', err);
    }
  };

  const handleSelectBusinessModel = async (model: 'service' | 'retail') => {
    setBusinessModel(model);
    setShowOnboarding(false);
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, businessModel: model }),
      });
    } catch (err) {
      console.error('Error updating business model:', err);
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
                ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 shadow-lg shadow-emerald-950/50' 
                : 'bg-[#151D3B] text-[#25D366]'
            }`}>
              <WhatsAppBrandIcon className="w-5 h-5 text-[#25D366]" />
            </div>
            {active === 'whatsapp' && (
              <>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-white">WhatsApp</h2>
                  <p className="text-xs text-[#E9D5FF]">Atendimento IA & Instâncias</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="px-3 py-1 rounded-full bg-[#86198F]/20 border border-[#86198F]/40 text-[#E9D5FF] text-xs font-bold capitalize">
                    Plano {userPlan}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowUpgradeModal(true); }}
                    className="px-3 py-1 rounded-full bg-[#FACC15] text-slate-950 text-xs font-extrabold hover:bg-[#FDE047] transition-all flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Upgrade</span>
                  </button>
                </div>
              </>
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

              {/* Action Buttons & Human Handoff */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleFetchQr}
                      className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10 flex items-center space-x-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Gerenciar Instância</span>
                    </button>

                    {!botPaused ? (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleTogglePauseBot(2)}
                          disabled={pausingBot}
                          className="px-4 py-2.5 rounded-xl bg-[#86198F]/20 hover:bg-[#86198F]/40 text-[#E9D5FF] border border-[#86198F]/50 font-bold text-xs transition-colors flex items-center space-x-1.5"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#FACC15]" />
                          <span>Assumir Conversa (Pausar 2h)</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTogglePauseBot(null)}
                        disabled={pausingBot}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Reativar IA Agora</span>
                      </button>
                    )}
                  </div>

                  <span className="text-xs text-[#E9D5FF]/70 font-mono">Easypanel Host</span>
                </div>

                {botPaused && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Atendimento Humano Ativo:</strong> O bot de IA está pausado até{' '}
                        {botPausedUntil ? new Date(botPausedUntil).toLocaleString('pt-BR') : 'retomada manual'}.
                      </span>
                    </div>
                    <button
                      onClick={() => handleTogglePauseBot(null)}
                      className="font-bold text-amber-400 hover:underline shrink-0 ml-2"
                    >
                      Reativar IA
                    </button>
                  </div>
                )}

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
              {businessModel === 'service' ? (
                <Calendar className="w-5 h-5 text-[#FACC15]" />
              ) : businessModel === 'retail' ? (
                <ShoppingBag className="w-5 h-5 text-[#FACC15]" />
              ) : (
                <InstagramBrandIcon className="w-5 h-5 text-[#E1306C]" />
              )}
            </div>
            {active === 'instagram' && (
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white">
                  {businessModel === 'service' ? 'Agenda Inteligente' : businessModel === 'retail' ? 'CRM & Vendas' : 'Instagram'}
                </h2>
                <p className="text-xs text-[#E9D5FF]">
                  {businessModel === 'service' ? 'Google Calendar (SSOT)' : businessModel === 'retail' ? 'Dashboard Financeiro & KPIs' : 'Automação & Carrosséis'}
                </p>
              </div>
            )}
          </div>
          {active !== 'instagram' && (
            <span className="text-xs font-semibold text-[#E9D5FF]/60 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
              {businessModel === 'service' ? 'Agenda' : businessModel === 'retail' ? 'Vendas & CRM' : 'Instagram'}
            </span>
          )}
        </div>

        {/* Column Inner Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === 'instagram' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* SERVICE VIEW: Agenda Inteligente */}
              {businessModel === 'service' && (
                <>
                  <div className="p-6 rounded-2xl bg-[#111936] border border-[#581C87]/30 backdrop-blur-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#FACC15] uppercase tracking-wider">
                        Agenda Inteligente — Google Calendar (SSOT)
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          SSOT CONECTADO
                        </span>
                        <button
                          onClick={handleRun24hCron}
                          disabled={triggeringCron}
                          className="px-3 py-1 rounded-lg bg-[#581C87] hover:bg-[#6b21a8] text-[#FACC15] font-bold text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{triggeringCron ? 'Disparando...' : 'Testar Confirmação 24h (Cron)'}</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                      A IA consulta a disponibilidade em tempo real e realiza os agendamentos salvando o número do WhatsApp do cliente no evento.
                    </p>

                    {cronTriggerMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-semibold">
                        ✅ {cronTriggerMsg}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agendamentos & Google Calendar</h4>
                      <button 
                        onClick={() => setNewApptModal(true)}
                        className="text-xs text-[#FACC15] font-semibold hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Agendamento</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {appointmentsList.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs bg-[#111936] rounded-xl border border-slate-800">
                          Nenhum agendamento futuro encontrado.
                        </div>
                      ) : (
                        appointmentsList.map((appt: any) => {
                          const dateObj = new Date(appt.appointment_time);
                          const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                          const dateStr = dateObj.toLocaleDateString('pt-BR');
                          return (
                            <div key={appt.id || appt.customer_phone} className="p-4 rounded-xl bg-[#111936] border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="px-3 py-1.5 rounded-lg bg-[#581C87] text-[#FACC15] font-bold text-xs font-mono text-center">
                                  <div>{timeStr}</div>
                                  <div className="text-[9px] text-[#E9D5FF]">{dateStr}</div>
                                </div>
                                <div>
                                  <h5 className="font-bold text-sm text-white">{appt.customer_name} • {appt.service_name}</h5>
                                  <p className="text-xs text-[#E9D5FF]/60 font-mono">WhatsApp: {appt.customer_phone}</p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                appt.status === 'confirmed' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {appt.status === 'confirmed' ? 'CONFIRMADO 24H' : 'AGENDADO / SSOT'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* RETAIL VIEW: CRM & Dashboard Financeiro */}
              {businessModel === 'retail' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800">
                      <span className="text-xs text-[#E9D5FF]/60 font-medium">Vendas Hoje (IA + Manual)</span>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">R$ 1.450,00</p>
                      <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">▲ +18% em relação a ontem</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800">
                      <span className="text-xs text-[#E9D5FF]/60 font-medium">Faturamento Convertido IA</span>
                      <p className="text-2xl font-bold text-[#FACC15] mt-1">R$ 12.890,00</p>
                      <span className="text-[10px] text-[#FACC15]/80 mt-1 block">100% BYOAI (R$ 0,00 Custo SaaS)</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800">
                      <span className="text-xs text-[#E9D5FF]/60 font-medium">Origem dos Leads</span>
                      <p className="text-sm font-bold text-white mt-1">78% WhatsApp • 22% Instagram</p>
                      <span className="text-[10px] text-[#E9D5FF]/60 mt-1 block">34 conversões esta semana</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline de Vendas Automatizado (CRM)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-[#090E22] border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-[#FACC15] flex items-center justify-between">
                          <span>Qualificados pela IA</span>
                          <span className="px-2 py-0.5 rounded bg-[#FACC15]/10 text-[10px]">5</span>
                        </span>
                        <div className="p-3 rounded-lg bg-[#111936] border border-slate-800 text-xs">
                          <span className="font-bold text-white block">Kit Promoção Verão</span>
                          <span className="text-[10px] text-[#E9D5FF]/60 block font-mono mt-0.5">(11) 99123-4567 • R$ 390,00</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#090E22] border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center justify-between">
                          <span>Aguardando Pagamento</span>
                          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-[10px]">3</span>
                        </span>
                        <div className="p-3 rounded-lg bg-[#111936] border border-slate-800 text-xs">
                          <span className="font-bold text-white block">Pedido #1089 - PIX</span>
                          <span className="text-[10px] text-[#E9D5FF]/60 block font-mono mt-0.5">(11) 98765-4321 • R$ 520,00</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#090E22] border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                          <span>Vendas Concluídas</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-[10px]">8</span>
                        </span>
                        <div className="p-3 rounded-lg bg-[#111936] border border-slate-800 text-xs">
                          <span className="font-bold text-white block">Combo Varejo Premium</span>
                          <span className="text-[10px] text-[#E9D5FF]/60 block font-mono mt-0.5">(11) 97777-1111 • R$ 540,00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* DEFAULT VIEW: Carrosséis IA / Instagram */}
              {!businessModel && (
                <>
                  <div className="p-6 rounded-2xl bg-[#111936] border border-[#86198F]/30 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-[#FACC15] uppercase tracking-wider mb-2">
                      Painel de Criação — Carrosséis IA
                    </h3>
                    <p className="text-sm text-[#E9D5FF]/80 leading-relaxed">
                      Gere conteúdos estruturados em slides com base nos dados da empresa e aprove rascunhos antes da publicação.
                    </p>
                  </div>

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
                </>
              )}

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

      {/* MODAL: NEW APPOINTMENT */}
      {newApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#111936] border border-[#581C87]/40 p-6 rounded-3xl max-w-md w-full space-y-4 relative">
            <button onClick={() => setNewApptModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="font-bold text-white text-base">Novo Agendamento — Google Calendar SSOT</h3>
            <p className="text-xs text-slate-400">Insira os dados do cliente para salvar na agenda e vincular ao atendimento de IA</p>
            <form onSubmit={handleCreateAppointment} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Nome do Cliente</label>
                <input 
                  type="text"
                  required
                  value={apptCustomerName}
                  onChange={e => setApptCustomerName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full px-3 py-2 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">WhatsApp do Cliente</label>
                <input 
                  type="text"
                  required
                  value={apptCustomerPhone}
                  onChange={e => setApptCustomerPhone(e.target.value)}
                  placeholder="Ex: 51998877665"
                  className="w-full px-3 py-2 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Serviço / Procedimento</label>
                <input 
                  type="text"
                  required
                  value={apptServiceName}
                  onChange={e => setApptServiceName(e.target.value)}
                  placeholder="Ex: Consulta Presencial Estética"
                  className="w-full px-3 py-2 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Data e Hora</label>
                <input 
                  type="datetime-local"
                  required
                  value={apptTime}
                  onChange={e => setApptTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <button 
                type="submit"
                disabled={creatingAppt}
                className="w-full py-3 mt-2 bg-[#FACC15] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 hover:bg-[#FDE047]"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>{creatingAppt ? 'Agendando no Google Calendar...' : 'Confirmar & Sincronizar SSOT'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ONBOARDING MODAL */}
      <OnboardingModal isOpen={showOnboarding} onSelect={handleSelectBusinessModel} />

      {/* UPGRADE MODAL */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        currentPlan={userPlan} 
        onSelectPlan={handleSelectPlan} 
      />

    </div>
  );
}
