'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import CheckoutMercadoPagoModal from '../dashboard/CheckoutMercadoPagoModal';

export default function PlanosPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{ name: string; price: string } | null>(null);

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

      {/* SaaS Pricing Plans Section */}
      <main className="flex-1 py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4 shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
          <span>Planos SaaS Transparentes & Sem Taxas Escondidas</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Escolha o Plano Ideal Para Seu Negócio
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-10 leading-relaxed">
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
            <span>Garantia de 7 dias</span>
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

      {/* Mercado Pago Checkout Modal */}
      {selectedCheckoutPlan && (
        <CheckoutMercadoPagoModal
          isOpen={!!selectedCheckoutPlan}
          onClose={() => setSelectedCheckoutPlan(null)}
          planName={selectedCheckoutPlan.name}
          planPrice={selectedCheckoutPlan.price}
          onPaymentConfirmed={() => {
            setSelectedCheckoutPlan(null);
            window.location.href = '/login';
          }}
        />
      )}
    </div>
  );
}
