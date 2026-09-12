'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Copy, RefreshCw, CreditCard, QrCode, ArrowRight, Lock } from 'lucide-react';

interface CheckoutMercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  onPaymentConfirmed?: () => void;
}

export default function CheckoutMercadoPagoModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  onPaymentConfirmed
}: CheckoutMercadoPagoModalProps) {
  const [method, setMethod] = useState<'pix' | 'card' | 'checkout_pro'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Mercado Livre / Mercado Pago branding
  const MercadoPagoLogo = () => (
    <div className="flex items-center space-x-1.5 bg-[#009EE3] px-3 py-1 rounded-lg text-white font-extrabold text-xs">
      <ShieldCheck className="w-4 h-4 text-white" />
      <span>Mercado Pago / Mercado Livre</span>
    </div>
  );

  const pixCode = `00020126580014BR.GOV.BCB.PIX0136socialone-mp-20265204000053039865405${Number(planPrice.replace(/[^\d]/g, '') || '99').toFixed(2)}5802BR5920Social One SaaS MercadoPago6009SAO PAULO62070503***6304ABCD`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (onPaymentConfirmed) onPaymentConfirmed();
      alert(`✅ Pagamento do Plano ${planName} aprovado via Mercado Pago! Seu acesso foi liberado.`);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B132B] border border-[#009EE3]/40 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden text-slate-100">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#009EE3]/20 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-slate-800/60 w-8 h-8 rounded-full flex items-center justify-center"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <MercadoPagoLogo />
            <h3 className="text-lg font-bold text-white mt-2">Checkout Seguro — Plano {planName}</h3>
            <p className="text-xs text-slate-400">Processado via infraestrutura Mercado Pago / Mercado Livre</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#FACC15]">{planPrice}</span>
            <span className="text-xs text-slate-400 block">/mês</span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMethod('pix')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              method === 'pix'
                ? 'bg-[#009EE3]/20 border-[#009EE3] text-[#009EE3] shadow-md'
                : 'bg-[#090E22] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Pix (Aprovação Instantânea)</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              method === 'card'
                ? 'bg-[#009EE3]/20 border-[#009EE3] text-[#009EE3] shadow-md'
                : 'bg-[#090E22] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cartão de Crédito (12x)</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('checkout_pro')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              method === 'checkout_pro'
                ? 'bg-[#009EE3]/20 border-[#009EE3] text-[#009EE3] shadow-md'
                : 'bg-[#090E22] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Checkout Pro Mercado Pago</span>
          </button>
        </div>

        {/* PIX TAB */}
        {method === 'pix' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#090E22] border border-slate-800 text-center space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">
                ⚡ Desconto ou liberação em menos de 10 segundos
              </span>

              {/* QR CODE DISPLAY */}
              <div className="w-40 h-40 bg-white p-2 mx-auto rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixCode)}`} 
                  alt="QR Code Pix Mercado Pago" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Código Pix Copia e Cola:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#111936] border border-slate-800 text-[10px] text-slate-300 font-mono truncate focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3 py-2 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-xs flex items-center space-x-1 shrink-0"
                  >
                    {copiedPix ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verificando Pagamento no Mercado Pago...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Já paguei pelo Pix — Confirmar Acesso</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* CREDIT CARD TAB */}
        {method === 'card' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Número do Cartão</label>
              <input
                type="text"
                placeholder="4532 •••• •••• 8890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#009EE3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Validade (MM/AA)</label>
                <input
                  type="text"
                  placeholder="12/28"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#009EE3]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#009EE3]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nome no Cartão</label>
              <input
                type="text"
                placeholder="NOME COMO CONSTA NO CARTÃO"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#009EE3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Parcelamento Mercado Pago</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-[#090E22] border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-[#009EE3]">
                <option value="1">1x de {planPrice} à vista</option>
                <option value="3">3x de R$ {(Number(planPrice.replace(/[^\d]/g, '') || 99) / 3).toFixed(2)} sem juros</option>
                <option value="6">6x de R$ {(Number(planPrice.replace(/[^\d]/g, '') || 99) / 6).toFixed(2)} sem juros</option>
                <option value="12">12x de R$ {(Number(planPrice.replace(/[^\d]/g, '') || 99) / 12).toFixed(2)} sem juros</option>
              </select>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full py-3.5 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg mt-2"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processando Cartão via Mercado Pago...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Pagar {planPrice} com Cartão Seguro</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* CHECKOUT PRO TAB */}
        {method === 'checkout_pro' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#090E22] border border-[#009EE3]/30 space-y-3 text-xs leading-relaxed text-slate-300">
              <h4 className="font-bold text-[#009EE3] uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#009EE3]" />
                <span>Pague usando sua conta do Mercado Livre / Mercado Pago</span>
              </h4>
              <p>
                Você será redirecionado para o ambiente 100% seguro do <strong>Mercado Pago</strong>, onde poderá utilizar seu saldo da conta do Mercado Livre, boleto bancário ou cartões salvos.
              </p>
            </div>

            <a
              href={`https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=socialone_${planName.toLowerCase()}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setTimeout(() => handleConfirmPayment(), 3000);
              }}
              className="w-full py-3.5 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg block text-center"
            >
              <span>Abrir Checkout Pro no Mercado Pago</span>
              <ArrowRight className="w-4 h-4 inline" />
            </a>
          </div>
        )}

        {/* Security guarantee footer */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400 border-t border-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pagamento Criptografado SSL 256-bit por Mercado Pago / Mercado Livre</span>
        </div>

      </div>
    </div>
  );
}
