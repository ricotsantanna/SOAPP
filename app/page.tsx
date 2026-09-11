'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  MessageSquare, 
  Key, 
  FileText, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Globe,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden">
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-brand-violet/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
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
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-semibold text-slate-200 hover:text-white px-4 py-2 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-brand-amber text-slate-950 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-brand-amber/20 flex items-center space-x-2 text-sm"
            >
              <span>Testar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-amber" />
          <span>Plataforma Integrada de IA Corporativa</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight mb-8">
          IA e Redes Sociais <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-amber">
            em um só lugar.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed">
          Descomplique a automação corporativa e o atendimento ao cliente, transformando canais de mensagens em centrais inteligentes movidas a inteligência artificial — com autonomia total de custos e dados no modelo <strong className="text-brand-amber">Bring Your Own AI (BYOAI)</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto bg-brand-amber text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl shadow-brand-amber/25 flex items-center justify-center space-x-3"
          >
            <span>Criar Minha Central de IA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#recursos"
            className="w-full sm:w-auto glass-panel text-slate-200 font-semibold text-base px-8 py-4 rounded-xl hover:border-brand-violet/60 transition-all flex items-center justify-center space-x-2"
          >
            <span>Ver Como Funciona</span>
          </a>
        </div>

        {/* Feature Highlights Grid */}
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
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp via Evolution API</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Conexão instantânea via QR Code em segundos. Atendimento humanizado 24/7 diretamente na sua conta WhatsApp Business.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-brand-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">RAG Base de Conhecimento</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Injete PDFs e conecte o Google Drive para respostas 100% fundamentadas nos dados e catálogo real da sua empresa.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive: BYOAI & Benefits */}
      <section id="byoai" className="py-20 px-6 border-t border-brand-violet/10 bg-brand-darkNavy/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-bold uppercase tracking-wider mb-4">
              Sem Fricção Técnica
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              Sua Inteligência Artificial, Suas Regras e Seu Orçamento.
            </h2>
            <p className="text-slate-300 text-base mb-6 leading-relaxed">
              Diferente dos chatbots tradicionais que cobram por mensagem enviada, a **Social One** adota a filosofia *Bring Your Own AI*. Você insere sua própria API Key e paga centavos de dólar diretamente ao provedor da sua escolha.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm">
                  <strong>Suporte Multiprovedor:</strong> Alternância simples entre modelos OpenAI (GPT-4o) e Google Gemini.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm">
                  <strong>Segurança Criptografada:</strong> Chaves armazenadas com criptografia AES-256 no Vercel Postgres.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm">
                  <strong>Persona Customizada:</strong> Defina o tom de voz, regras de negócio e orientações da IA.
                </span>
              </li>
            </ul>

            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <span>Configurar Minha Chave</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-brand-violet/30 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-slate-400">socialone_byoai_config.json</span>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-500 mb-1">// Provedores Configurados</div>
                <div className="text-brand-amber">&quot;provider&quot;: &quot;openai_gpt4o&quot;,</div>
                <div className="text-slate-400">&quot;encrypted_key&quot;: &quot;U2FsdGVkX19x7A...3a8F&quot;,</div>
                <div className="text-emerald-400 mt-2">&quot;status&quot;: &quot;ACTIVE_AND_VALIDATED&quot;</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-500 mb-1">// Persona do Atendimento WhatsApp</div>
                <div className="text-brand-lavender">&quot;system_prompt&quot;: &quot;Você é a Sofia, atendente oficial da Social One. Responda dúvidas sobre produtos com cordialidade...&quot;</div>
              </div>
            </div>
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-brand-violet/40 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-magenta flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-violet/30">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Acessar o Social One</h2>
              <p className="text-xs text-slate-400 mt-1">
                Digite seu e-mail para entrar no painel de controle corporativo
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="seuemail@empresa.com.br"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-amber text-slate-950 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-brand-amber/20 text-sm flex items-center justify-center space-x-2"
              >
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
