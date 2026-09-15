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
  ShieldCheck,
  Menu,
  X,
  Zap,
  Clock,
  DollarSign,
  MessageSquareOff,
  LayoutGrid
} from 'lucide-react';

import CheckoutMercadoPagoModal from './dashboard/CheckoutMercadoPagoModal';
import Header from './components/Header';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{ name: string; price: string } | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const body: Record<string, string> = { email, password };
      if (authMode === 'register' && name.trim()) body.name = name.trim();

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
        return;
      }

      if (data.user) {
        localStorage.setItem('socialone_user', JSON.stringify(data.user));
      }

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Social One',
    description: 'Atenda clientes 24/7 no WhatsApp com IA, sem taxa por mensagem. Modelo BYOAI: use sua própria chave e tenha controle total de custo.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://www.socialoneapp.com.br',
    offers: [
      {
        '@type': 'Offer',
        name: 'Start',
        price: '99.00',
        priceCurrency: 'BRL',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Agenda IA',
        price: '149.00',
        priceCurrency: 'BRL',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Social One (Full)',
        price: '199.00',
        priceCurrency: 'BRL',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-brand-violet/15 rounded-full blur-3xl pointer-events-none" />

      {/* Reusable Header with Official Logo */}
      <Header onOpenAuth={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />

      {/* Hero Section */}
      <section id="recursos" className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
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

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
          Descomplique a automação corporativa e o atendimento ao cliente, transformando canais de mensagens em centrais inteligentes movidas a inteligência artificial — com autonomia total de custos no modelo <strong className="text-brand-amber">Bring Your Own AI (BYOAI)</strong>.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#planos"
            className="w-full sm:w-auto bg-brand-amber text-slate-950 font-extrabold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-brand-amber/20 flex items-center justify-center space-x-2 text-sm transform hover:scale-105"
          >
            <span>Começar agora</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#tecnologia"
            className="w-full sm:w-auto border border-brand-violet/40 bg-brand-violet/10 text-brand-lavender hover:bg-brand-violet/20 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Ver como funciona</span>
            <ChevronRight className="w-4 h-4 text-brand-amber" />
          </a>
        </div>
      </section>

      {/* Seção Dor -> Solução */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Você reconhece algum{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-amber">
            desses problemas?
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-16 leading-relaxed">
          O Social One foi construído para resolver exatamente isso.
        </p>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto text-left">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-base font-bold text-brand-amber mb-3 leading-snug">
                "Perco venda porque não consigo responder todo mundo a tempo."
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Atendimento automático 24/7 que responde na hora, inclusive de madrugada e fim de semana.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-brand-lavender" />
              </div>
              <h3 className="text-base font-bold text-brand-amber mb-3 leading-snug">
                "Pago caro em ferramentas que cobram por mensagem enviada."
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Com o modelo BYOAI você usa sua própria chave de IA. Sem taxa por mensagem, custo previsível e no seu controle.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-4">
                <MessageSquareOff className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-base font-bold text-brand-amber mb-3 leading-snug">
                "Minha equipe repete as mesmas respostas o dia inteiro."
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              A IA aprende com seus PDFs e documentos e responde sozinha sobre produtos, preços e procedimentos.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-brand-lavender" />
              </div>
              <h3 className="text-base font-bold text-brand-amber mb-3 leading-snug">
                "Vivo alternando entre WhatsApp, Instagram e agenda."
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tudo em um painel só — conversas, agendamento e redes sociais centralizados.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-base font-bold text-brand-amber mb-3 leading-snug">
                "Já testei chatbot e o cliente percebe que é robô."
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Atendimento humanizado, e você assume a conversa a qualquer momento com o Human Handoff.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Cards Técnicos (BYOAI / WhatsApp / RAG) */}
      <section id="tecnologia" className="relative py-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-semibold mb-8">
          <Sparkles className="w-4 h-4 text-brand-amber" />
          <span>Tecnologia de Ponta para Resolver Suas Dores</span>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left">
          <div id="byoai" className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-brand-amber" />
            </div>
            <span className="font-bold text-brand-lavender block mb-2 text-sm">
              Seu custo de IA sob controle
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Arquitetura BYOAI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use sua própria chave OpenAI ou Google Gemini. Zero taxa sobre inferência e controle financeiro absoluto.
            </p>
          </div>

          <div id="whatsapp" className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-brand-lavender" />
            </div>
            <span className="font-bold text-brand-lavender block mb-2 text-sm">
              Resposta instantânea, sem perder cliente
            </span>
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp Evolution API</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Conexão instantânea via QR Code em segundos. Atendimento humanizado 24/7 na sua conta WhatsApp Business.
            </p>
          </div>

          <div id="rag" className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-brand-amber" />
            </div>
            <span className="font-bold text-brand-lavender block mb-2 text-sm">
              Sua equipe não repete respostas de novo
            </span>
            <h3 className="text-lg font-bold text-white mb-2">RAG Base de Conhecimento</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Injete PDFs e Google Drive. Os documentos são <strong className="text-brand-lavender">convertidos para Markdown</strong> automaticamente, reduzindo o consumo de tokens em até 60% e economizando o saldo da sua chave.
            </p>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Plans Section */}
      <section id="planos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4 shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
          <span>Planos SaaS Transparentes & Sem Taxas Escondidas</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Escolha o Plano Ideal Para Seu Negócio
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-10 leading-relaxed">
          Pague apenas pelo software e traga sua própria chave de Inteligência Artificial (<strong className="text-brand-amber">BYOAI</strong>). Sem custo por mensagem enviada.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center mb-16">
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center space-x-2 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faturamento Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-brand-amber to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Faturamento Anual</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-950 text-brand-amber text-[10px] font-extrabold uppercase tracking-wide">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto items-stretch">
          {/* Start Plan */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between relative group hover:shadow-2xl hover:shadow-slate-900/50">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Start</span>
                {billingCycle === 'annual' && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Economize R$ 240/ano
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {billingCycle === 'annual' ? 'R$ 79' : 'R$ 99'}
                </span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Essencial para pequenos negócios iniciarem com automação inteligente no WhatsApp.
              </p>
              
              <div className="w-full h-px bg-slate-800/80 mb-6" />

              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Atendimento Automático WhatsApp 24/7</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>BYOAI — Sua própria chave OpenAI/Gemini</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Base de Conhecimento (RAG/PDFs)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Human Handoff (Pausar IA a qualquer momento)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({
                name: `Start ${billingCycle === 'annual' ? '(Plano Anual 20% OFF)' : '(Plano Mensal)'}`,
                price: billingCycle === 'annual' ? 'R$ 79' : 'R$ 99'
              })}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 group-hover:bg-slate-700"
            >
              <span>Assinar Start ({billingCycle === 'annual' ? 'R$ 79/mês' : 'R$ 99/mês'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Agenda IA Plan (Featured Popular) */}
          <div className="glass-card p-8 rounded-3xl border-2 border-brand-amber relative shadow-2xl shadow-brand-amber/10 flex flex-col justify-between transform md:-translate-y-3 bg-gradient-to-b from-[#151D3B] to-[#0D1326]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-amber to-yellow-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-lg shadow-brand-amber/30 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>MAIS POPULAR (SERVIÇOS)</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 mt-2">
                <span className="text-xs font-extrabold text-brand-amber uppercase tracking-widest">Agenda IA</span>
                {billingCycle === 'annual' && (
                  <span className="text-[10px] bg-brand-amber/20 text-brand-amber border border-brand-amber/40 px-2 py-0.5 rounded-full font-bold">
                    Economize R$ 360/ano
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {billingCycle === 'annual' ? 'R$ 119' : 'R$ 149'}
                </span>
                <span className="text-xs text-slate-300">/mês</span>
              </div>
              <p className="text-xs text-brand-lavender/90 mb-6 leading-relaxed">
                Ideal para prestadores de serviços, clínicas, médicos, advogados e consultórios.
              </p>

              <div className="w-full h-px bg-brand-amber/20 mb-6" />

              <ul className="space-y-3.5 text-xs text-slate-100 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <span className="font-extrabold text-white">Tudo do Plano Start +</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <span>Agenda Inteligente Google Calendar (SSOT)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <span>Agendamento & remarcação automática via WhatsApp</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <span>Confirmação Ativa de Consultas 24h via Cron Job</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({
                name: `Agenda IA ${billingCycle === 'annual' ? '(Plano Anual 20% OFF)' : '(Plano Mensal)'}`,
                price: billingCycle === 'annual' ? 'R$ 119' : 'R$ 149'
              })}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-amber via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-xl shadow-brand-amber/25 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
            >
              <span>Assinar Agenda IA ({billingCycle === 'annual' ? 'R$ 119/mês' : 'R$ 149/mês'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Social One Plan (Enterprise / Full) */}
          <div className="glass-card p-8 rounded-3xl border border-brand-violet/40 hover:border-brand-violet transition-all flex flex-col justify-between relative group hover:shadow-2xl hover:shadow-brand-violet/20">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-brand-lavender uppercase tracking-widest">Social One (Full)</span>
                {billingCycle === 'annual' && (
                  <span className="text-[10px] bg-brand-violet/20 text-brand-lavender border border-brand-violet/40 px-2 py-0.5 rounded-full font-bold">
                    Economize R$ 480/ano
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {billingCycle === 'annual' ? 'R$ 159' : 'R$ 199'}
                </span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Para e-commerces, varejo, agências de marketing digital e médias empresas.
              </p>

              <div className="w-full h-px bg-brand-violet/20 mb-6" />

              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-lavender shrink-0 mt-0.5" />
                  <span className="font-extrabold text-white">Tudo do Plano Agenda IA +</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-lavender shrink-0 mt-0.5" />
                  <span>Instagram Direct DMs & Respostas em Comentários</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-lavender shrink-0 mt-0.5" />
                  <span>CRM Avançado, Pipeline de Vendas & Dashboard</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-lavender shrink-0 mt-0.5" />
                  <span>Estúdio de Conteúdo & Carrosséis IA para Redes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedCheckoutPlan({
                name: `Social One ${billingCycle === 'annual' ? '(Plano Anual 20% OFF)' : '(Plano Mensal)'}`,
                price: billingCycle === 'annual' ? 'R$ 159' : 'R$ 199'
              })}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-90 text-white font-bold text-xs transition-all shadow-lg shadow-brand-violet/20 flex items-center justify-center space-x-2"
            >
              <span>Assinar Social One ({billingCycle === 'annual' ? 'R$ 159/mês' : 'R$ 199/mês'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mercado Pago Security Trust Banner */}
        <div className="mt-16 max-w-3xl mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-left">
              <span className="font-bold text-white block">Pagamentos 100% Seguros via Mercado Pago</span>
              <span className="text-[11px] text-slate-400">Aceitamos Pix (liberação imediata), Cartão de Crédito em até 12x e Boleto.</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 font-semibold text-[11px]">
            <span>Garantia de 7 dias — devolução total do valor pago se cancelar nesse período</span>
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
          <div className="flex items-center space-x-6 flex-wrap justify-center gap-y-2">
            <Link href="/sobre" className="hover:text-brand-amber transition-colors">Sobre a Plataforma</Link>
            <Link href="/faq" className="hover:text-brand-amber transition-colors">Perguntas Frequentes (FAQ)</Link>
            <Link href="/contato" className="hover:text-brand-amber transition-colors">Contato</Link>
            <Link href="/privacidade" className="hover:text-brand-amber transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-brand-amber transition-colors">Termos de Uso</Link>
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
                window.location.href = '/api/auth/google';
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
              {/* Name field — only for registration */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet"
                  />
                </div>
              )}

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
