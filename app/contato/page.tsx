'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Headphones
} from 'lucide-react';

import Header from '../components/Header';

export default function ContatoPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [assunto, setAssunto] = useState('Suporte Técnico');
  const [mensagem, setMensagem] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4">
            <Headphones className="w-4 h-4 text-brand-amber" />
            <span>Atendimento & Suporte Especializado</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Fale Conosco
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Dúvidas sobre os Planos SaaS, configuração da chave BYOAI ou suporte técnico? Nossa equipe está pronta para responder seu atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Cards Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-brand-violet/30 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-brand-amber" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">E-mail Suporte & Vendas</h3>
                <p className="text-xs text-slate-400 mb-2">Envie sua mensagem diretamente para nossa equipe.</p>
                <a href="mailto:suporte@socialoneapp.com.br" className="text-xs font-bold text-brand-amber hover:underline">
                  suporte@socialoneapp.com.br
                </a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-brand-magenta/30 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-brand-lavender" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Atendimento WhatsApp</h3>
                <p className="text-xs text-slate-400 mb-2">Atendimento rápido via mensagens corporativas.</p>
                <span className="text-xs font-bold text-brand-lavender block">
                  +55 (21) 99999-9999
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Horário de Atendimento</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Humano:</strong> Segunda a Sexta, das 09h às 18h.<br />
                  <strong>IA 24/7:</strong> Assistente virtual disponível todos os dias.
                </p>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-brand-violet/40 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Mensagem Enviada!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Obrigado por entrar em contato. Um de nossos especialistas retornará seu atendimento no e-mail informado em até 2 horas úteis.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMensagem(''); }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-4">Envie uma Mensagem</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome</label>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="carlos@empresa.com.br"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Telefone</label>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="(21) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Assunto</label>
                      <select
                        value={assunto}
                        onChange={(e) => setAssunto(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-violet"
                      >
                        <option value="Suporte Técnico">Suporte Técnico</option>
                        <option value="Planos SaaS & Vendas">Planos SaaS & Vendas</option>
                        <option value="Dúvidas BYOAI">Dúvidas Modelo BYOAI</option>
                        <option value="Parcerias & Enterprise">Parcerias & Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mensagem</label>
                    <textarea
                      required
                      rows={4}
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Como podemos ajudar sua empresa?"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-violet resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-amber via-yellow-400 to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-amber/20 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Enviando Mensagem...' : 'Enviar Mensagem'}</span>
                  </button>
                </form>
              )}
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
            <Link href="/sobre" className="hover:text-white transition-colors">Sobre a Plataforma</Link>
            <Link href="/contato" className="text-brand-amber font-semibold">Contato</Link>
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
