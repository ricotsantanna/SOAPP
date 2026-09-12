'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  MessageSquare, 
  QrCode, 
  Zap, 
  ShieldCheck, 
  UserCheck, 
  Clock 
} from 'lucide-react';

import Header from '../components/Header';

export default function WhatsappPage() {
  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Evolution API 2.4+ & WhatsApp Business</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Automação WhatsApp Inteligente. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-lavender">
              Conexão Instantânea via QR Code.
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Conecte seu WhatsApp Business sem complicações técnicas em menos de 10 segundos. Atendimento humanizado 24 horas por dia, 7 dias por semana.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
              <QrCode className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Escaneie & Conecte</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Abra o WhatsApp no seu smartphone, leia o QR Code gerado no painel do Social One e pronto! Sua instância está online.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-brand-violet/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6 text-brand-lavender" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Human Handoff (Pausar IA)</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Qualquer atendente humano pode pausar a IA a qualquer momento no painel de atendimento para assumir a conversa com o cliente.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-brand-amber/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Lembretes & Cron Jobs</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Envio autônomo de lembretes de consultas e reuniões agendadas 24h antes, reduzindo o no-show e aumentando os resultados do seu negócio.
            </p>
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
          <div className="flex items-center space-x-6 flex-wrap justify-center gap-y-2">
            <Link href="/sobre" className="hover:text-brand-amber transition-colors">Sobre a Plataforma</Link>
            <Link href="/contato" className="hover:text-brand-amber transition-colors">Contato</Link>
            <Link href="/privacidade" className="hover:text-brand-amber transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-brand-amber transition-colors">Termos de Uso</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
