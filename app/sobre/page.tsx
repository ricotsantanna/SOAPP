'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Zap, 
  CheckCircle2,
  Users,
  Target,
  Globe
} from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-brand-violet/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet via-brand-magenta to-brand-amber flex items-center justify-center shadow-lg shadow-brand-violet/30 group-hover:scale-105 transition-transform duration-300">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-lavender">
              Social One
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-brand-amber" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full relative z-10">
        {/* Hero Badge & Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
            <span>Automação Autêntica & IA Corporativa</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Sobre a Plataforma <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-amber">
              Social One
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Nossa missão é democratizar a inteligência artificial corporativa para empresas de todos os portes. Oferecemos uma plataforma SaaS completa de atendimento autônomo, agendamento inteligente e CRM integrados — sem intermediários e com controle absoluto no modelo <strong className="text-brand-amber">Bring Your Own AI (BYOAI)</strong>.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 rounded-3xl border border-brand-violet/30 hover:border-brand-violet/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-6">
              <Key className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Modelos BYOAI Autênticos</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Diferente de sistemas que cobram margens exorbitantes sobre tokens e mensagens, no Social One você conecta diretamente sua chave de API (OpenAI GPT-4o ou Google Gemini 1.5). Você paga apenas pela infraestrutura do software.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-brand-magenta/30 hover:border-brand-magenta/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-brand-lavender" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">WhatsApp & Instagram Unificados</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Conecte sua conta do WhatsApp Business em segundos via Evolution API e gerencie DMs do Instagram via Meta Graph API oficial. Seu cliente é atendido instantaneamente 24/7 com resposta humanizada.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-brand-amber/30 hover:border-brand-amber/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Agenda Inteligente Google Calendar</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Integração nativa de fonte única da verdade (SSOT). A IA verifica horários livres, realiza o agendamento em tempo real e agenda lembretes de confirmação ativa no WhatsApp 24h antes da consulta ou reunião.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Base de Conhecimento RAG</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Injete catálogos em PDF, Manuais de Procedimentos ou links de sites. Nossa tecnologia RAG (Retrieval-Augmented Generation) garante respostas 100% embasadas na documentação oficial do seu negócio.
            </p>
          </div>
        </div>

        {/* Value Metrics Section */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-brand-violet/40 mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
            Por que empresas escolhem o Social One?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-extrabold text-brand-amber">99.9%</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Uptime Garantido</div>
              <p className="text-xs text-slate-300">Infraestrutura em nuvem redundante de alta disponibilidade.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold text-brand-lavender">0%</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Taxa Sobre Mensagens</div>
              <p className="text-xs text-slate-300">Sem surpresas na fatura no final do mês.</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold text-emerald-400">24/7</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Atendimento Autônomo</div>
              <p className="text-xs text-slate-300">IA treinada para qualificar leads e fechar agendamentos.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-violet/20 bg-slate-950 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-violet" />
            <span className="font-bold text-slate-200">Social One</span>
            <span>— socialoneapp.com.br</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/sobre" className="text-brand-amber font-semibold">Sobre a Plataforma</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
