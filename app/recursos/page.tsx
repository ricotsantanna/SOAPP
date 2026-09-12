'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Key, 
  Calendar, 
  FileText, 
  Users, 
  BarChart3, 
  Instagram,
  Zap,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function RecursosPage() {
  const recursos = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Evolution API 2.4+',
      badge: 'Mensagens 24/7',
      desc: 'Atendimento instantâneo no seu número comercial via QR Code. Resposta contextual autônoma, envio de áudios, imagens e handoff para atendente humano.',
      color: 'brand-violet'
    },
    {
      icon: Instagram,
      title: 'Instagram Direct & Comentários (Meta API)',
      badge: 'Engajamento Meta',
      desc: 'Responda DMs e comentários em posts do Instagram automaticamente. Transforme interações sociais em leads qualificados no seu funil.',
      color: 'brand-magenta'
    },
    {
      icon: Key,
      title: 'Modelo BYOAI (Bring Your Own AI)',
      badge: 'Zero Markup',
      desc: 'Conecte suas próprias chaves de API da OpenAI (GPT-4o) ou Google Gemini (1.5 Pro/Flash). Controle custos sem pagar intermediários.',
      color: 'brand-amber'
    },
    {
      icon: Calendar,
      title: 'Agenda Inteligente Google Calendar (SSOT)',
      badge: 'Confirmação Ativa',
      desc: 'Sincronização bidirecional em tempo real. A IA marca, remarca consultas e dispara confirmações automáticas 24h antes via Cron Job.',
      color: 'sky-400'
    },
    {
      icon: FileText,
      title: 'Base de Conhecimento RAG (PDFs & Drive)',
      badge: 'Sem Alucinações',
      desc: 'Injete manuais, arquivos PDF e URLs de catálogos. A IA responde exclusivamente com base nos dados oficiais da sua empresa.',
      color: 'emerald-400'
    },
    {
      icon: Users,
      title: 'CRM & Pipeline de Vendas KanBan',
      badge: 'Gestão de Leads',
      desc: 'Visualize todas as conversas organizadas por etapas do funil. Atribua tags, anotações de equipe e controle a jornada do cliente.',
      color: 'brand-lavender'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

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
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
            <span>Recursos SaaS de Alta Performance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Tudo o Que Seu Negócio Precisa Para Automatizar
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Uma suíte corporativa completa combinando Inteligência Artificial, atendimento multicanal, CRM e agendamento autônomo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {recursos.map((r, i) => {
            const IconComponent = r.icon;
            return (
              <div key={i} className="glass-card p-8 rounded-3xl border border-brand-violet/30 hover:border-brand-violet/60 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-brand-amber" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber px-2.5 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{r.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-brand-violet/40 text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Pronto para impulsionar suas vendas e agendamentos?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mb-8">
            Escolha o plano ideal no Social One e comece a atuar com automação de IA em menos de 5 minutos.
          </p>
          <Link
            href="/planos"
            className="bg-gradient-to-r from-brand-amber via-yellow-400 to-amber-500 text-slate-950 font-extrabold px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-xl shadow-brand-amber/25 text-sm"
          >
            Ver Planos SaaS ✨
          </Link>
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
