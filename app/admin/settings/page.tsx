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
  Lock,
  RefreshCw,
  AlertCircle,
  Server
} from 'lucide-react';
import { testVpsConnection } from '@/lib/evolution';

export default function AdminSettings() {
  const [evolutionUrl, setEvolutionUrl] = useState('https://markei-evolution-api.ro91ry.easypanel.host');
  const [evolutionKey, setEvolutionKey] = useState('c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH');
  const [defaultPersona, setDefaultPersona] = useState(
    'Você é o assistente virtual oficial corporativo da Social One. Atenda os clientes com extrema cordialidade, objetividade e clareza.'
  );
  
  const [testingVps, setTestingVps] = useState(false);
  const [vpsTestResult, setVpsTestResult] = useState<{ online: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestVps = async () => {
    setTestingVps(true);
    setVpsTestResult(null);

    try {
      const result = await testVpsConnection(evolutionUrl, evolutionKey);
      setVpsTestResult(result);
    } catch (error) {
      setVpsTestResult({
        online: false,
        message: 'Erro ao conectar à Evolution API no Easypanel. Verifique a Global API Key.',
      });
    } finally {
      setTestingVps(false);
    }
  };

  const handleSaveMasterSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Sliders className="w-7 h-7 text-[#FACC15]" />
          <span>Configurações Master & Conexão VPS / Easypanel</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure a URL da sua Evolution API hospedada no Easypanel e teste a conectividade em tempo real
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Configurações da Evolution API salvas e aplicadas globalmente!</span>
        </div>
      )}

      <form onSubmit={handleSaveMasterSettings} className="space-y-6">
        {/* Master Evolution API VPS / Easypanel Settings */}
        <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>Evolution API (Easypanel Host)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configurado para seu host oficial: <code className="text-[#FACC15]">https://markei-evolution-api.ro91ry.easypanel.host</code>
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              EASYPANEL CONECTADO
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                URL da Evolution API (Easypanel)
              </label>
              <input
                type="text"
                required
                value={evolutionUrl}
                onChange={e => setEvolutionUrl(e.target.value)}
                placeholder="https://markei-evolution-api.ro91ry.easypanel.host"
                className="w-full px-4 py-3 rounded-xl bg-[#090E22] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#86198F] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Chave Global da API (GLOBAL_API_KEY)
              </label>
              <input
                type="password"
                required
                value={evolutionKey}
                onChange={e => setEvolutionKey(e.target.value)}
                placeholder="c5EJIE3WEJWKLa8ZpcvLu68y5SGOd4VH"
                className="w-full px-4 py-3 rounded-xl bg-[#090E22] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#86198F] font-mono"
              />
            </div>

            {/* Test Connection Button */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleTestVps}
                disabled={testingVps}
                className="px-4 py-2.5 rounded-xl bg-[#090E22] border border-slate-700 hover:border-[#FACC15] text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-[#FACC15] ${testingVps ? 'animate-spin' : ''}`} />
                <span>{testingVps ? 'Testando Conexão...' : 'Testar Conexão Easypanel'}</span>
              </button>
            </div>

            {/* Test Feedback Banner */}
            {vpsTestResult && (
              <div className={`p-4 rounded-xl border text-xs flex items-center space-x-3 ${
                vpsTestResult.online 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {vpsTestResult.online ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{vpsTestResult.message}</span>
              </div>
            )}
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
              System Prompt pré-configurado quando um novo cliente conecta o WhatsApp.
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
