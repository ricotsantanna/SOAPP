'use client';

import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  ShieldCheck, 
  QrCode
} from 'lucide-react';

interface InstanceItem {
  id?: number;
  user_id: number;
  instance_name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  phone_number?: string;
  user_email?: string;
}

export default function AdminInstances() {
  const [instances, setInstances] = useState<InstanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        if (data.instances) setInstances(data.instances);
      }
    } catch (error) {
      console.error('Error fetching instances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Radio className="w-7 h-7 text-emerald-400 animate-pulse" />
            <span>Monitor Global de Instâncias WhatsApp</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visão consolidada de todas as instâncias da Evolution API pareadas pelos clientes no SaaS
          </p>
        </div>

        <button
          onClick={fetchInstances}
          className="px-4 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Status</span>
        </button>
      </div>

      {/* Instances Table */}
      <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-[#FACC15]" />
            <span>Instâncias Registradas ({instances.length})</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono">EVOLUTION API CONECTADA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090E22] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Nome da Instância</th>
                <th className="p-3">Cliente (Dono)</th>
                <th className="p-3">Número Conectado</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação Remota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {instances.map((inst) => (
                <tr key={inst.id || inst.instance_name} className="hover:bg-[#090E22]/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#FACC15]">
                    {inst.instance_name}
                  </td>
                  <td className="p-3 text-slate-300 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inst.user_email || `user_#${inst.user_id}`}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">
                    {inst.phone_number || 'Aguardando pareamento'}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      inst.status === 'connected'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {inst.status === 'connected' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>CONECTADO</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>DESCONECTADO</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={fetchInstances}
                      className="px-3 py-1 rounded-lg bg-[#090E22] border border-slate-700 hover:border-[#FACC15] text-xs font-semibold text-slate-300 hover:text-white transition-all"
                    >
                      Testar Ping
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
