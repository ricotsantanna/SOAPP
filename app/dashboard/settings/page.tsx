'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Bot, 
  Save, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function DashboardSettings() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'Você é o assistente virtual corporativo inteligente da Social One. Atenda os clientes com extrema cordialidade, clareza e agilidade.'
  );

  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Save OpenAI Key if provided
      if (openaiKey) {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_key', provider: 'openai', key: openaiKey }),
        });
      }

      // Save Gemini Key if provided
      if (geminiKey) {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_key', provider: 'gemini', key: geminiKey }),
        });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Key className="w-7 h-7 text-brand-amber" />
          <span>Configurações do BYOAI & System Prompt</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gerencie suas chaves de API e defina a personalidade do seu atendimento automatizado
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Configurações salvas e criptografadas com sucesso no banco Vercel Postgres!</span>
        </div>
      )}

      <form onSubmit={handleSaveKeys} className="space-y-6">
        {/* Section 1: BYOAI API Keys */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-violet" />
                <span>Chaves de API do Usuário (BYOAI)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Suas chaves são salvas criptografadas (AES-256) e usadas exclusivamente para processar suas mensagens.
              </p>
            </div>
            <span className="bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-bold px-3 py-1 rounded-full">
              Custo Zero SaaS
            </span>
          </div>

          <div className="space-y-4">
            {/* OpenAI Key Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API OpenAI (GPT-4o / GPT-4o-mini)</label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Gemini Key Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Chave de API Google Gemini (Gemini 1.5 Flash / Pro)</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Persona & System Prompt */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-brand-lavender" />
              <span>Persona & Prompt de Sistema</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instrua a IA sobre o tom de voz, regras de atendimento e detalhes da sua empresa.
            </p>
          </div>

          <div>
            <textarea
              rows={5}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-violet font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-amber text-slate-950 font-extrabold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-brand-amber/20 flex items-center space-x-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
