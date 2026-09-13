'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Bot, 
  Save, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Sparkles,
  Zap,
  CreditCard,
  PlusCircle,
  MessageSquare,
  Cpu,
  AlertTriangle,
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface AISettings {
  billing_mode: 'byoai' | 'managed';
  api_provider: 'openai' | 'gemini';
  api_key?: string;
  system_prompt?: string;
  bot_paused_until?: string;
  monthly_message_limit: number;
  messages_used_this_month: number;
  courtesy_credits: number;
  courtesy_granted: boolean;
  is_quota_blocked: boolean;
  rollover_credits: number;
  pending_invoice_charges: number;
  alert_80_sent: boolean;
  alert_100_sent: boolean;
}

export default function DashboardSettings() {
  const [settings, setSettings] = useState<AISettings>({
    billing_mode: 'byoai',
    api_provider: 'openai',
    monthly_message_limit: 3000,
    messages_used_this_month: 0,
    courtesy_credits: 0,
    courtesy_granted: false,
    is_quota_blocked: false,
    rollover_credits: 0,
    pending_invoice_charges: 0,
    alert_80_sent: false,
    alert_100_sent: false,
    system_prompt: 'Você é o assistente virtual oficial da empresa. Atenda os clientes via WhatsApp com máxima cordialidade e responda com base nos documentos da base de conhecimento.'
  });

  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buyingExtra, setBuyingExtra] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [extraSuccess, setExtraSuccess] = useState<string | null>(null);

  // Load AI Settings on mount
  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Erro ao carregar ai_settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Save BYOAI keys if provided
      if (openaiKey) {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_key', provider: 'openai', key: openaiKey }),
        });
      }

      if (geminiKey) {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_key', provider: 'gemini', key: geminiKey }),
        });
      }

      // Save main AI engine settings
      const res = await fetch('/api/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing_mode: settings.billing_mode,
          api_provider: settings.api_provider,
          system_prompt: settings.system_prompt,
          monthly_message_limit: settings.monthly_message_limit,
          is_quota_blocked: settings.is_quota_blocked
        }),
      });

      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBuyExtraPack = async () => {
    setBuyingExtra(true);
    setExtraSuccess(null);
    try {
      const res = await fetch('/api/ai/extra-pack', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setExtraSuccess(data.message);
        if (data.settings) setSettings(data.settings);
        setTimeout(() => setExtraSuccess(null), 6000);
      }
    } catch (err) {
      console.error('Erro ao contratar pacote extra:', err);
    } finally {
      setBuyingExtra(false);
    }
  };

  // Calculations for progress gauge
  const used = settings.messages_used_this_month || 0;
  const limit = settings.monthly_message_limit || 3000;
  const percent = Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Cpu className="w-7 h-7 text-brand-amber" />
            <span>Motor de IA & Gestão de Faturamento</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Especificação Consolidada do Motor de IA com Modelo Híbrido (BYOAI / IA Gerenciada), Limites Suaves e Recargas Pós-Pagas.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSettings}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Configurações do Motor de IA atualizadas e criptografadas com sucesso!</span>
        </div>
      )}

      {extraSuccess && (
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm flex items-center space-x-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 shrink-0 text-purple-400" />
          <span>{extraSuccess}</span>
        </div>
      )}

      {/* SECTION 1: Operating Mode Selector (BYOAI vs Managed) */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-brand-violet" />
              <span>Modo de Operação da Inteligência Artificial</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha entre usar sua própria chave de API (BYOAI) ou utilizar a infraestrutura gerenciada de altíssima performance do Social One.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card BYOAI */}
          <div 
            onClick={() => setSettings({ ...settings, billing_mode: 'byoai' })}
            className={`cursor-pointer p-5 rounded-xl border transition-all ${
              settings.billing_mode === 'byoai'
                ? 'bg-brand-violet/10 border-brand-violet ring-2 ring-brand-violet/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-white text-base flex items-center space-x-2">
                <Key className="w-4 h-4 text-brand-amber" />
                <span>BYOAI (Bring Your Own AI)</span>
              </span>
              {settings.billing_mode === 'byoai' && (
                <span className="bg-brand-violet text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">ATIVO</span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Insira sua chave de API própria (OpenAI ou Gemini). O Social One atua como orquestrador <strong>sem aplicar limites de mensagens</strong>. Custos debitados direto da sua conta no provedor.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-brand-amber font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Custo Zero de Plataforma / Mensagens Ilimitadas</span>
            </div>
          </div>

          {/* Card IA Gerenciada */}
          <div 
            onClick={() => setSettings({ ...settings, billing_mode: 'managed' })}
            className={`cursor-pointer p-5 rounded-xl border transition-all ${
              settings.billing_mode === 'managed'
                ? 'bg-brand-lavender/10 border-brand-lavender ring-2 ring-brand-lavender/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-white text-base flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-lavender" />
                <span>IA Gerenciada (Plataforma)</span>
              </span>
              {settings.billing_mode === 'managed' && (
                <span className="bg-brand-lavender text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">ATIVO</span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Operação ponta a ponta sem atrito. Infraestrutura do Social One utilizando GPT-4o-mini ou Gemini 1.5 Flash com RAG avançado.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Custo de inferência &lt; R$ 0,003/msg | Régua com Soft Limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quotas, Consumption Gauge & Post-Paid Extra Packages (Managed Mode) */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-brand-amber" />
              <span>Consumo da Franquia Mensal & Saldo de Recargas</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Régua inteligente de consumo com limites suaves (Soft Limits) e bônus automático de cortesia.
            </p>
          </div>
          {Number(settings.pending_invoice_charges || 0) > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 self-start sm:self-auto">
              <CreditCard className="w-4 h-4" />
              <span>Próxima Fatura: + R$ {Number(settings.pending_invoice_charges).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Progress Gauge */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span>Consumo da Franquia Base:</span>
              <span className="text-white font-extrabold">{used.toLocaleString()} / {limit.toLocaleString()} msgs</span>
            </span>
            <span className={percent >= 100 ? 'text-rose-400' : percent >= 80 ? 'text-amber-400' : 'text-emerald-400'}>
              {percent}% utilizado
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percent >= 100 
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                  : percent >= 80 
                    ? 'bg-gradient-to-r from-brand-violet to-amber-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-brand-violet'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Status Badges & Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Courtesy Bonus Badge */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Bônus Cortesia (100%)</span>
                <span className="text-xs font-extrabold text-white">
                  {settings.courtesy_credits} msgs disponíveis
                </span>
              </div>
            </div>

            {/* Rollover Credits Badge */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <PlusCircle className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Pacotes Extra (Rollover)</span>
                <span className="text-xs font-extrabold text-white">
                  {settings.rollover_credits} msgs (não expiram)
                </span>
              </div>
            </div>

            {/* Quota Block / Human Handoff Status */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-3">
              {settings.is_quota_blocked ? (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              ) : (
                <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Status do Atendimento</span>
                <span className={`text-xs font-extrabold ${settings.is_quota_blocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {settings.is_quota_blocked ? 'Transbordo Humano' : 'IA Operando Normalmente'}
                </span>
              </div>
            </div>
          </div>

          {/* 100% Offer Banner (Cenário A vs Cenário B) */}
          {(percent >= 100 || settings.courtesy_granted || settings.is_quota_blocked) && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-brand-violet/10 border border-amber-500/30 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Oferta de Expansão de Cota (1-Clique)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Atingiu 100% da franquia? Liberamos <strong>300 mensagens de cortesia de presente</strong>! Ative o pacote extra de <strong>1.500 mensagens por apenas R$ 10,00</strong> (cobrado somente na sua próxima fatura, sem expirar).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-amber-500/20 gap-3">
                <span className="text-[11px] text-slate-400">
                  Total com ativação: <strong>300 (presente) + 1.500 (extra) = 1.800 msgs úteis</strong>
                </span>
                <button
                  type="button"
                  disabled={buyingExtra}
                  onClick={handleBuyExtraPack}
                  className="w-full sm:w-auto bg-amber-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shadow-md shadow-amber-400/20 flex items-center justify-center space-x-2 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{buyingExtra ? 'Ativando...' : 'Ativar +1.500 msgs (R$ 10,00 na Fatura)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* SECTION 3: BYOAI API Keys (Active when Mode === byoai) */}
        <div className={`glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-6 ${settings.billing_mode !== 'byoai' ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-violet" />
                <span>Chaves de API do Usuário (BYOAI)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Suas chaves são salvas criptografadas (AES-256) e usadas exclusivamente para processar suas mensagens.
              </p>
            </div>
            <span className="bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-bold px-3 py-1 rounded-full">
              Custo Zero SaaS
            </span>
          </div>

          <div className="space-y-4">
            {/* Active Provider Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Provedor Ativo Preferencial</label>
              <select
                value={settings.api_provider}
                onChange={(e) => setSettings({ ...settings, api_provider: e.target.value as 'openai' | 'gemini' })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-violet"
              >
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
              </select>
            </div>

            {/* OpenAI Key Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API OpenAI</label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Gemini Key Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API Google Gemini</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: System Prompt & Persona */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-brand-lavender" />
              <span>Persona & Prompt de Sistema</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instrua a IA sobre o tom de voz, regras de atendimento e detalhes operacionais do seu negócio.
            </p>
          </div>

          <div>
            <textarea
              rows={5}
              value={settings.system_prompt || ''}
              onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-amber text-slate-950 font-extrabold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-brand-amber/20 flex items-center space-x-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

