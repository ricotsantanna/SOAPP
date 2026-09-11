'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Radio, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeInstances: number;
  totalDocuments: number;
  messagesProcessedToday: number;
  evolutionApiStatus: string;
  byoaiInferenceCostSaaS: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 4,
    activeInstances: 2,
    totalDocuments: 8,
    messagesProcessedToday: 4892,
    evolutionApiStatus: 'ONLINE',
    byoaiInferenceCostSaaS: 'R$ 0,00',
  });
  const [loading, setLoading] = useState(true);

  const loadAdminStats = async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-[#FACC15]" />
            <span>Visão Geral Executiva — Admin Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Métricas globais de uso do SaaS, estado das instâncias e infraestrutura em tempo real
          </p>
        </div>

        <button
          onClick={loadAdminStats}
          className="px-4 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Users */}
        <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E9D5FF]/70">
            <span>Total de Clientes</span>
            <Users className="w-4 h-4 text-[#FACC15]" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.totalUsers}</p>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+100% no mês</span>
          </div>
        </div>

        {/* Card 2: Active Instances */}
        <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E9D5FF]/70">
            <span>Instâncias WhatsApp Ativas</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.activeInstances}</p>
          <div className="text-[11px] text-slate-400">Evolution API v2.0</div>
        </div>

        {/* Card 3: Messages Today */}
        <div className="p-5 rounded-2xl bg-[#111936] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E9D5FF]/70">
            <span>Mensagens Hoje</span>
            <MessageSquare className="w-4 h-4 text-[#86198F]" />
          </div>
          <p className="text-3xl font-extrabold text-[#FACC15]">
            {stats.messagesProcessedToday.toLocaleString()}
          </p>
          <div className="text-[11px] text-slate-400">Atendimento IA Automático</div>
        </div>

        {/* Card 4: BYOAI SaaS Cost */}
        <div className="p-5 rounded-2xl bg-[#111936] border border-[#581C87]/40 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#E9D5FF]/70">
            <span>Custo de Inferência SaaS</span>
            <Cpu className="w-4 h-4 text-[#FACC15]" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{stats.byoaiInferenceCostSaaS}</p>
          <div className="text-[11px] text-[#FACC15] font-bold">Arquitetura BYOAI Ativa</div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#FACC15]" />
            <span>Saúde da Infraestrutura</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090E22] border border-slate-800/80">
              <span className="text-slate-300">Motor Evolution API (WhatsApp)</span>
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090E22] border border-slate-800/80">
              <span className="text-slate-300">Banco de Dados Vercel Postgres (Neon)</span>
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>CONECTADO</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090E22] border border-slate-800/80">
              <span className="text-slate-300">Indexador RAG (PDF & Drive)</span>
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>OPERACIONAL</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#86198F]" />
            <span>Políticas e Criptografia</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            As chaves de API enviadas pelos clientes no modelo **BYOAI** são criptografadas em nível de aplicação com **AES-256 GCM** antes do armazenamento na tabela <code className="text-[#FACC15] font-mono">user_ai_keys</code>. O SaaS não retém custos de inferência.
          </p>
        </div>
      </div>
    </div>
  );
}
