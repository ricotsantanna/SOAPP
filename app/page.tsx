'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  MessageSquare, 
  Key, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import CheckoutMercadoPagoModal from './dashboard/CheckoutMercadoPagoModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{ name: string; price: string } | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Falha na autenticação');
        return;
      }

      // Redirect based on user role
      if (data.user?.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Auth submit error:', error);
      setAuthError('Erro ao conectar ao servidor de autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-brand-violet/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-brand-violet/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center shadow-lg shadow-brand-violet/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-lavender to-brand-violet">
                Social One
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-brand-amber ml-2 px-2 py-0.5 rounded-full bg-brand-amber/10 border border-brand-amber/30">
                SaaS Enterprise
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-brand-amber transition-colors">Recursos</a>
            <a href="#byoai" className="hover:text-brand-amber transition-colors">Modelo BYOAI</a>
            <a href="#rag" className="hover:text-brand-amber transition-colors">Base de Conhecimento</a>
            <a href="#whatsapp" className="hover:text-brand-amber transition-colors">WhatsApp API</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-sm font-semibold text-slate-200 hover:text-white px-4 py-2 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="bg-brand-amber text-slate-950 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-brand-amber/20 flex items-center space-x-2 text-sm"
            >
              <span>Testar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-amber" />
          <span>Plataforma Autêntica de IA Corporativa com BYOAI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight mb-8">
          IA e Redes Sociais <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-amber">
            em um só lugar.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed">
          Descomplique a automação corporativa e o atendimento ao cliente, transformando canais de mensagens em centrais inteligentes movidas a inteligência artificial — com autonomia total de custos no modelo <strong className="text-brand-amber">Bring Your Own AI (BYOAI)</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
          <button
            onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
            className="w-full sm:w-auto bg-brand-amber text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl shadow-brand-amber/25 flex items-center justify-center space-x-3"
          >
            <span>Criar Minha Conta</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleQuickDemoFill('admin@socialoneapp.com.br', 'admin123456')}
            className="w-full sm:w-auto glass-panel text-brand-lavender font-semibold text-base px-8 py-4 rounded-xl hover:border-brand-violet/60 transition-all flex items-center justify-center space-x-2 border border-brand-violet/40"
          >
            <ShieldCheck className="w-5 h-5 text-brand-amber" />
            <span>Acesso Super Admin</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left">
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Arquitetura BYOAI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use sua própria chave OpenAI ou Google Gemini. Zero taxa sobre inferência e controle financeiro absoluto.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-brand-lavender" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp Evolution API</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Conexão instantânea via QR Code em segundos. Atendimento humanizado 24/7 na sua conta WhatsApp Business.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">RAG Base de Conhecimento</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Injete PDFs e conecte o Google Drive para respostas 100% fundamentadas nos dados e catálogo da sua empresa.
            </p>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Plans Section */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#86198F]/20 border border-[#86198F]/40 text-[#E9D5FF] text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-[#FACC15]" />
          <span>Planos Transparentes e Escaláveis</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Escolha o Plano Ideal Para Seu Negócio
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-12">
          Sem taxas ocultas por mensagem. Escolha o plano de recursos e traga sua própria inteligência artificial (BYOAI).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          {/* Start Plan */}
          <div className="p-8 rounded-3xl bg-[#111936] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Start</span>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-4xl font-extrabold text-white">R$ 99</span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Essencial para pequenos negócios iniciarem com IA no WhatsApp.</p>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Atendimento Automático WhatsApp 24/7</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>BYOAI — Sua própria chave OpenAI/Gemini</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Base de Conhecimento (RAG/PDFs)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Human Handoff (Pausar IA)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({ name: 'Start', price: 'R$ 99' })}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Assinar Start (Mercado Pago)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Agenda IA Plan (Featured) */}
          <div className="p-8 rounded-3xl bg-[#151D3B] border-2 border-[#FACC15] relative shadow-2xl flex flex-col justify-between transform md:-translate-y-2">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FACC15] text-slate-950 font-extrabold text-[10px] uppercase tracking-widest shadow-lg">
              POPULAR (SERVIÇOS)
            </span>
            <div>
              <span className="text-xs font-bold text-[#FACC15] uppercase tracking-widest block mb-2">Agenda IA</span>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-4xl font-extrabold text-white">R$ 149</span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="text-xs text-[#E9D5FF]/80 mb-6">Ideal para prestadores de serviços, clínicas e consultórios.</p>
              
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
                  <span className="font-bold">Tudo do Plano Start +</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
                  <span>Agenda Inteligente Google Calendar (SSOT)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
                  <span>Agendamento automático via WhatsApp</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
                  <span>Confirmação Ativa 24h via Cron Job</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({ name: 'Agenda IA', price: 'R$ 149' })}
              className="w-full py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-[#FACC15]/20 flex items-center justify-center space-x-1.5"
            >
              <span>Assinar Agenda IA (Mercado Pago)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Social One Plan (Max) */}
          <div className="p-8 rounded-3xl bg-[#111936] border border-[#86198F]/50 flex flex-col justify-between hover:border-[#86198F] transition-all">
            <div>
              <span className="text-xs font-bold text-[#E9D5FF] uppercase tracking-widest block mb-2">Social One</span>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-4xl font-extrabold text-white">R$ 199</span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Para e-commerces, varejo, agências e marketing digital.</p>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E9D5FF] shrink-0" />
                  <span className="font-bold">Tudo do Plano Agenda +</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E9D5FF] shrink-0" />
                  <span>Instagram Direct DMs (Meta Graph API)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E9D5FF] shrink-0" />
                  <span>CRM, Vendas & Dashboard Financeiro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E9D5FF] shrink-0" />
                  <span>Estúdio de Conteúdo & Carrosséis IA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({ name: 'Social One', price: 'R$ 199' })}
              className="w-full py-3.5 rounded-xl bg-[#86198F] hover:bg-[#a21caf] text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Assinar Social One (Mercado Pago)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-violet/20 bg-slate-950 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-violet" />
            <span className="font-bold text-slate-200">Social One</span>
            <span>— socialoneapp.com.br</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION MODAL WITH PASSWORD & GOOGLE OAUTH */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-brand-violet/40 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-violet/30">
                <Lock className="w-6 h-6 text-brand-amber" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {authMode === 'login' ? 'Acessar o Social One' : 'Criar Nova Conta'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'login' 
                  ? 'Digite seu e-mail e senha corporativa para entrar' 
                  : 'Cadastre suas credenciais para criar seu workspace de IA'}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 mb-6 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  authMode === 'login' ? 'bg-brand-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Entrar (Login)
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  authMode === 'register' ? 'bg-brand-violet text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cadastrar-se
              </button>
            </div>

            {/* Google OAuth Login Button */}
            <button
              type="button"
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-all mb-4 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuar com o Google</span>
            </button>

            <div className="relative flex py-2 items-center my-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-semibold uppercase">ou acesse via e-mail</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@empresa.com.br"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-amber text-slate-950 font-extrabold py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-brand-amber/20 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Autenticando...' : authMode === 'login' ? 'Entrar no Painel' : 'Criar Minha Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Mercado Pago Modal */}
      {selectedCheckoutPlan && (
        <CheckoutMercadoPagoModal
          isOpen={!!selectedCheckoutPlan}
          onClose={() => setSelectedCheckoutPlan(null)}
          planName={selectedCheckoutPlan.name}
          planPrice={selectedCheckoutPlan.price}
          onPaymentConfirmed={() => {
            setSelectedCheckoutPlan(null);
            setAuthMode('register');
            setShowAuthModal(true);
          }}
        />
      )}
    </div>
  );
}
