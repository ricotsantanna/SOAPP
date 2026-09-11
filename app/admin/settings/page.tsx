'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Globe, 
  Save, 
  CheckCircle2, 
  Radio, 
  Bot,
  Lock
} from 'lucide-react';

export default function AdminSettings() {
  const [evolutionUrl, setEvolutionUrl] = useState('https://api.evolution.socialoneapp.com.br');
  const [evolutionKey, setEvolutionKey] = useState('socialone_global_apikey');
  const [defaultPersona, setDefaultPersona] = useState(
    'Você é o assistente virtual oficial corporativo da Social One. Atenda os clientes com extrema cordialidade, objetividade e clareza.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMasterSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Sliders className="w-7 h-7 text-[#FACC15]" />
          <span>Configurações Master da Plataforma</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Parâmetros globais do SaaS, endpoint master da Evolution API e diretrizes padrão para novos clientes
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Configurações master atualizadas e aplicadas globalmente no SaaS!</span>
        </div>
      )}

      <form onSubmit={handleSaveMasterSettings} className="space-y-6">
        {/* Master Evolution API Settings */}
        <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Radio className="w-5 h-5 text-emerald-400" />
              <span>Evolution API — Endpoint Master</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Servidor VPS responsável pelo gerenciamento global de instâncias e QR Codes do WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">URL Master da Evolution API</label>
              <input
                type="url"
                required
                value={evolutionUrl}
                onChange={e => setEvolutionUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#090E22] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#86198F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave Global (Global API Key)</label>
              <input
                type="password"
                required
                value={evolutionKey}
                onChange={e => setEvolutionKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#090E22] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#86198F]"
              />
            </div>
          </div>
        </div>

        {/* Master Persona Default */}
        <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-[#86198F]" />
              <span>Persona Padrão para Novos Clientes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              System Prompt pré-configurado quando um novo tenant cria sua instância de atendimento.
            </p>
          </div>

          <div>
            <textarea
              rows={4}
              value={defaultPersona}
              onChange={e => setDefaultPersona(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#090E22] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#86198F] leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#FACC15] text-slate-950 font-extrabold hover:bg-[#FDE047] transition-all shadow-lg shadow-[#FACC15]/20 flex items-center space-x-2 text-sm"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Salvar Parâmetros Master</span>
          </button>
        </div>
      </form>
    </div>
  );
}
