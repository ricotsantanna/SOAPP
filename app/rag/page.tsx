'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Globe, 
  Database, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function RagPage() {
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
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold mb-4">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Retrieval-Augmented Generation (RAG)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Base de Conhecimento RAG. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-brand-lavender to-brand-violet">
              Respostas 100% Fundamentadas nos Seus Dados.
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Acabe com respostas genéricas ou alucinações de IA. O Social One vetoriza seus manuais em PDF e URLs de sites para alimentar seu robô com a verdade do seu negócio.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 rounded-3xl border border-sky-500/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Upload de Documentos PDF</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Faça upload de catálogos de produtos, tabelas de preços e manuais operacionais. Nosso parser extrai e vetoriza cada trecho em milissegundos.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-brand-violet/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-brand-lavender" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Conexão de URLs & Sites</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Insira o endereço do seu site ou FAQ. A IA faz o rastreamento automático do conteúdo e mantém as respostas sempre atualizadas.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Busca Semântica por Embeddings</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Quando um cliente faz uma pergunta no WhatsApp, o sistema recupera apenas os parágrafos exatos necessários para responder com precisão cirúrgica.
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
