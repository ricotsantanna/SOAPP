'use client';

import React from 'react';
import { Sparkles, Check, Lock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'start' | 'agenda' | 'social' | 'max';
  onSelectPlan?: (plan: 'start' | 'agenda' | 'social' | 'max') => void;
}

import CheckoutMercadoPagoModal from './CheckoutMercadoPagoModal';

export default function UpgradeModal({ isOpen, onClose, currentPlan = 'start', onSelectPlan }: UpgradeModalProps) {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = React.useState<{ name: string; price: string; id: string } | null>(null);

  if (!isOpen && !selectedPlanForCheckout) return null;

  const plans = [
    {
      id: 'start',
      name: 'Start',
      price: 'R$ 99',
      period: '/mês',
      description: 'Essencial para automação de WhatsApp',
      features: [
        'Atendimento Automático WhatsApp 24/7',
        'BYOAI — Sua própria chave de API',
        'Base de Conhecimento (RAG/PDFs)',
        'Human Handoff (Pausar IA)',
        'Suporte por email'
      ],
      badge: 'Básico',
      accentColor: 'border-slate-800 bg-[#111936]'
    },
    {
      id: 'agenda',
      name: 'Agenda IA',
      price: 'R$ 149',
      period: '/mês',
      description: 'Ideal para prestadores de serviços e clínicas',
      features: [
        'Tudo do Plano Start +',
        'Agenda Inteligente Google Calendar (SSOT)',
        'Agendamento automático via WhatsApp',
        'Confirmação Ativa 24h via Cron',
        'Relatórios de Agendamentos'
      ],
      badge: 'Popular (Serviços)',
      popular: true,
      accentColor: 'border-[#FACC15]/50 bg-[#151D3B] ring-2 ring-[#FACC15]/30'
    },
    {
      id: 'social',
      name: 'Social One',
      price: 'R$ 199',
      period: '/mês',
      description: 'Para e-commerces, varejo e marketing digital',
      features: [
        'Tudo do Plano Agenda +',
        'CRM, Vendas & Dashboard Financeiro',
        'Estúdio de Conteúdo & Carrosséis IA',
        'Geração em Lote de Posts',
        'Suporte prioritário via WhatsApp'
      ],
      badge: 'Recomendado (Varejo)',
      accentColor: 'border-[#86198F]/50 bg-[#171435]'
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#581C87]/40 p-6 md:p-8 rounded-3xl max-w-4xl w-full shadow-2xl space-y-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#581C87]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#FACC15]/10 rounded-full blur-3xl pointer-events-none" />

            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#86198F]/20 border border-[#86198F]/40 text-[#E9D5FF] text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Faça Upgrade com Mercado Pago / Mercado Livre</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Desbloqueie todo o poder da IA no seu negócio
              </h2>
              <p className="text-xs md:text-sm text-slate-300">
                Escolha o plano ideal com pagamento seguro via Pix ou Cartão em até 12x no Mercado Pago.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {plans.map((p) => {
                const isCurrent = currentPlan === p.id;
                return (
                  <div 
                    key={p.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between relative transition-all duration-300 ${p.accentColor}`}
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FACC15] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        {p.badge}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white">{p.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Plano Atual
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{p.description}</p>

                      <div className="my-4">
                        <span className="text-3xl font-extrabold text-white">{p.price}</span>
                        <span className="text-xs text-slate-400">{p.period}</span>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {p.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                            <Check className="w-3.5 h-3.5 text-[#FACC15] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlanForCheckout({ name: p.name, price: p.price, id: p.id });
                      }}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                        isCurrent 
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : p.popular 
                            ? 'bg-[#FACC15] text-slate-950 hover:bg-[#FDE047] shadow-lg shadow-[#FACC15]/20'
                            : 'bg-[#86198F] text-white hover:bg-[#a21caf]'
                      }`}
                    >
                      <span>{isCurrent ? 'Seu Plano Atual' : `Pagar ${p.name} (Mercado Pago)`}</span>
                      {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5 pt-2 border-t border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia Mercado Pago: Pix instantâneo, Cartão em 12x e cancelamento a qualquer momento.</span>
            </div>
          </div>
        </div>
      )}

      {/* Mercado Pago Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutMercadoPagoModal
          isOpen={!!selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          planName={selectedPlanForCheckout.name}
          planPrice={selectedPlanForCheckout.price}
          onPaymentConfirmed={() => {
            if (onSelectPlan) onSelectPlan(selectedPlanForCheckout.id as any);
            onClose();
          }}
        />
      )}
    </>
  );
}
