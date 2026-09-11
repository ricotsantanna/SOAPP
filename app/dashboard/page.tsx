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
  Globe
} from 'lucide-react';

export default function DashboardMasterWorkspace() {
  const [active, setActive] = useState<'whatsapp' | 'instagram' | 'knowledge' | 'settings'>('whatsapp');

  // --- WHATSAPP STATE ---
  const [waStatus, setWaStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [waMessagesCount, setWaMessagesCount] = useState(1248);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Olá! Sou o atendente virtual do WhatsApp da Social One. Como posso te ajudar?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // --- INSTAGRAM STATE ---
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselTopic, setCarouselTopic] = useState('');
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [carousels, setCarousels] = useState<Array<{ id: number; title: string; slidesCount: number; date: string }>>([
    { id: 1, title: '5 Dicas para Automatizar seu Atendimento', slidesCount: 5, date: 'Hoje' },
    { id: 2, title: 'Por que o modelo BYOAI economiza até 90%?', slidesCount: 4, date: 'Ontem' },
    { id: 3, title: 'Como Conectar WhatsApp e IA em 2 Minutos', slidesCount: 6, date: 'Há 3 dias' }
  ]);

  // --- KNOWLEDGE BASE (RAG) STATE ---
  const [knowledgeFiles, setKnowledgeFiles] = useState<Array<{ id: number; name: string; type: string; size: string }>>([
    { id: 1, name: 'Catálogo_de_Produtos_e_Serviços_2026.pdf', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Política_de_Atendimento_e_Garantia.pdf', type: 'PDF', size: '890 KB' },
    { id: 3, name: 'Manual_Técnico_Social_One.pdf', type: 'PDF', size: '1.2 MB' },
  ]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // --- SETTINGS (BYOAI) STATE ---
  const [openaiKey, setOpenaiKey] = useState('sk-proj-7a892b...x99k');
  const [geminiKey, setGeminiKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    'Você é o assistente virtual oficial da empresa. Atenda os clientes via WhatsApp com máxima cordialidade e responda com base nos documentos da base de conhecimento.'
  );
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Handlers
  const handleSendWaMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, userId: 1 }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'Sem resposta.' }]);
      setWaMessagesCount(prev => prev + 1);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Erro ao conectar ao motor de IA.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFetchQr = async () => {
    setShowQrModal(true);
    try {
      const res = await fetch('/api/whatsapp?action=qrcode');
      const data = await res.json();
      setQrCodeData(data.qrcode || null);
    } catch (error) {
      console.error('QR Error:', error);
    }
  };

  const handleCreateCarousel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselTopic.trim()) return;

    setCarouselLoading(true);
    setTimeout(() => {
      setCarousels(prev => [
        {
          id: Date.now(),
          title: carouselTopic,
          slidesCount: 5,
          date: 'Agora'
        },
        ...prev
      ]);
      setCarouselTopic('');
      setCarouselLoading(false);
      setShowCarouselModal(false);
    }, 1200);
  };

  const handleUploadPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPdf(true);
    setTimeout(() => {
      setKnowledgeFiles(prev => [
        {
          id: Date.now(),
          name: files[0].name,
          type: 'PDF',
          size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`
        },
        ...prev
      ]);
      setUploadingPdf(false);
    }, 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 3000);
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
                    <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Conectado</span>
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

                  <span className="text-xs text-[#E9D5FF]/70 font-mono">Evolution API v2.0</span>
                </div>

                {/* Live Simulator Chat Box */}
                <div className="p-4 rounded-2xl bg-[#090E22] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <Bot className="w-4 h-4 text-[#FACC15]" />
                      <span>Simulador de Atendimento em Tempo Real</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
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
                      placeholder="Simular mensagem do cliente..."
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
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#86198F]/20 text-[#E9D5FF] border border-[#86198F]/40">
                          PRONTO
                        </span>
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
                          onClick={() => setKnowledgeFiles(prev => prev.filter(x => x.id !== f.id))}
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

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Provedor Ativo</span>
                  <p className="text-lg font-bold text-[#E9D5FF] mt-1">OpenAI (GPT-4o)</p>
                </div>
                <div className="p-4 rounded-xl bg-[#111936] border border-slate-800">
                  <span className="text-xs text-[#E9D5FF]/60">Status do Prompt</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">● Configurado</p>
                </div>
              </div>

              {savedSettingsMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configurações salvas e criptografadas com sucesso!</span>
                </div>
              )}

              {/* Settings Form */}
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API OpenAI (BYOAI)</label>
                  <div className="relative">
                    <input 
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiKey}
                      onChange={e => setOpenaiKey(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                    />
                    <button type="button" onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API Google Gemini (Opcional)</label>
                  <div className="relative">
                    <input 
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={e => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] pr-10"
                    />
                    <button type="button" onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">System Prompt / Persona do Negócio</label>
                  <textarea 
                    rows={4}
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#86198F] leading-relaxed"
                  />
                </div>

                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-slate-950 font-bold text-sm hover:bg-[#FDE047] transition-colors shadow-lg shadow-[#FACC15]/10"
                >
                  Salvar Configurações
                </button>
              </form>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#111936] border border-[#581C87]/40 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 relative">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="font-bold text-white text-base">Pareamento WhatsApp Business</h3>
            <p className="text-xs text-slate-400">Escaneie o QR Code com seu WhatsApp para conectar a Evolution API</p>
            <div className="w-56 h-56 bg-slate-950 mx-auto rounded-2xl border border-slate-800 p-2 flex items-center justify-center">
              {qrCodeData ? (
                <img src={qrCodeData} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="text-xs text-[#FACC15]">Gerando QR Code...</div>
              )}
            </div>
            <button onClick={() => setShowQrModal(false)} className="w-full py-2 bg-[#FACC15] text-slate-950 font-bold rounded-xl text-xs">
              Concluído
            </button>
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
