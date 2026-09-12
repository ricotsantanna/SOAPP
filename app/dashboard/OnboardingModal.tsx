'use client';

import React, { useState } from 'react';
import { Calendar, ShoppingBag, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSelect: (model: 'service' | 'retail') => void;
}

export default function OnboardingModal({ isOpen, onSelect }: OnboardingModalProps) {
  const [selected, setSelected] = useState<'service' | 'retail'>('service');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, businessModel: selected }),
      });
      onSelect(selected);
    } catch (err) {
      console.error('Failed to save business model:', err);
      onSelect(selected);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-8 rounded-3xl bg-[#090E22] border border-[#581C87]/50 shadow-2xl shadow-purple-950/50 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#581C87]/40 text-[#FACC15] border border-[#581C87]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Bem-vindo ao <span className="text-[#FACC15]">Social One</span>! 🚀
          </h2>
          <p className="text-xs text-[#E9D5FF]/80 max-w-md mx-auto leading-relaxed">
            Para personalizar a sua experiência e ajustar as ferramentas de IA, qual é o foco principal da sua empresa?
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card A: Service */}
          <div
            onClick={() => setSelected('service')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative space-y-3 ${
              selected === 'service'
                ? 'bg-[#111936] border-[#FACC15] ring-2 ring-[#FACC15]/30 shadow-lg shadow-purple-950/40'
                : 'bg-[#0B132B]/60 border-slate-800 hover:border-purple-800/60'
            }`}
          >
            {selected === 'service' && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-[#FACC15]" />
            )}
            <div className="p-2.5 rounded-xl bg-[#581C87] text-white w-fit">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Prestar Serviços & Consultas</h3>
              <p className="text-[11px] text-[#E9D5FF]/70 mt-1 leading-snug">
                Clínicas, consultórios, barbearias, advocacia e serviços com marcação de horários.
              </p>
            </div>
            <div className="pt-2 text-[10px] text-[#FACC15] font-semibold flex items-center space-x-1">
              <span>Ativa: Agenda Inteligente</span>
            </div>
          </div>

          {/* Card B: Retail */}
          <div
            onClick={() => setSelected('retail')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative space-y-3 ${
              selected === 'retail'
                ? 'bg-[#111936] border-[#FACC15] ring-2 ring-[#FACC15]/30 shadow-lg shadow-purple-950/40'
                : 'bg-[#0B132B]/60 border-slate-800 hover:border-purple-800/60'
            }`}
          >
            {selected === 'retail' && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-[#FACC15]" />
            )}
            <div className="p-2.5 rounded-xl bg-[#86198F] text-white w-fit">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Vender Produtos & Varejo</h3>
              <p className="text-[11px] text-[#E9D5FF]/70 mt-1 leading-snug">
                Lojas físicas, e-commerce, restaurantes, infoprodutos e vendas pelo WhatsApp.
              </p>
            </div>
            <div className="pt-2 text-[10px] text-[#FACC15] font-semibold flex items-center space-x-1">
              <span>Ativa: CRM & Dashboard Financeiro</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] text-slate-950 font-bold text-sm transition-all shadow-xl shadow-[#FACC15]/10 flex items-center justify-center space-x-2"
        >
          <span>{saving ? 'Configurando seu painel...' : 'Ativar Meu Painel Personalizado'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
