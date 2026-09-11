'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Info,
  Radio
} from 'lucide-react';

export default function DashboardChannels() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChannelStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp?action=status');
      const data = await res.json();
      setStatus(data.status || 'disconnected');
      if (data.phone) setPhoneNumber(data.phone);
    } catch (error) {
      console.error('Error fetching channel status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQr = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp?action=qrcode');
      const data = await res.json();
      setQrCodeData(data.qrcode || null);
      setStatus('connecting');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelStatus();
    handleGenerateQr();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <QrCode className="w-7 h-7 text-brand-amber" />
          <span>Conexão WhatsApp Business (Evolution API)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Escaneie o QR Code abaixo com seu WhatsApp para ativar a automação com IA
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* QR Code pairing panel */}
        <div className="glass-panel p-8 rounded-3xl border border-brand-violet/20 text-center space-y-6 flex flex-col items-center justify-center relative">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-brand-amber animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Instância: socialone_default</span>
          </div>

          {/* QR Code Container */}
          <div className="relative group">
            <div className="w-64 h-64 bg-slate-950 p-4 rounded-2xl border-2 border-brand-violet/40 flex items-center justify-center shadow-2xl overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center space-y-2 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-amber" />
                  <span className="text-xs">Gerando QR Code...</span>
                </div>
              ) : qrCodeData ? (
                <img
                  src={qrCodeData}
                  alt="WhatsApp Evolution QR Code"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-slate-500 text-xs">Clique abaixo para gerar novo QR Code</div>
              )}
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <button
              onClick={handleGenerateQr}
              disabled={loading}
              className="w-full bg-brand-amber text-slate-950 font-extrabold py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-md shadow-brand-amber/20 text-sm flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar QR Code</span>
            </button>

            <button
              onClick={fetchChannelStatus}
              className="w-full glass-card text-slate-300 font-semibold py-2.5 rounded-xl hover:text-white transition-all text-xs"
            >
              Verificar Conexão
            </button>
          </div>
        </div>

        {/* Status & Connection Details */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-brand-violet" />
              <span>Estado da Conexão</span>
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-3">
                {status === 'connected' ? (
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                )}
                <div>
                  <div className="text-sm font-bold text-white capitalize">
                    {status === 'connected' ? 'WhatsApp Conectado' : 'Aguardando Leitura do QR Code'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {phoneNumber ? `Número: ${phoneNumber}` : 'Instância pronta para pareamento'}
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                status === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Info className="w-4 h-4 text-brand-amber" />
              <span>Passo a Passo de Pareamento</span>
            </h3>

            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Abra o aplicativo do **WhatsApp** no seu celular corporativo.</li>
              <li>Acesse **Dispositivos Conectados** no menu do app.</li>
              <li>Toque em **Conectar um dispositivo**.</li>
              <li>Aponte a câmera para o **QR Code** exibido nesta página.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
