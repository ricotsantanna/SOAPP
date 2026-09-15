'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    window.dispatchEvent(
      new CustomEvent('cookie_consent_updated', { detail: { consent: 'accepted' } })
    );
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    window.dispatchEvent(
      new CustomEvent('cookie_consent_updated', { detail: { consent: 'rejected' } })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl border-t border-brand-violet/30 shadow-2xl animate-slideUp">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          <div className="p-2 rounded-xl bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-brand-amber" />
          </div>
          <div>
            <span className="font-bold text-white block mb-1">
              Privacidade & Transparência (LGPD)
            </span>
            <p>
              Usamos cookies para entender como você usa o site e melhorar sua experiência. Você pode aceitar ou recusar o uso de cookies não essenciais.{' '}
              <Link href="/privacidade" className="text-brand-amber underline font-medium hover:text-yellow-300 transition-colors">
                Saiba mais na nossa Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={handleReject}
            type="button"
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold transition-all text-xs sm:text-sm text-center"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            type="button"
            className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber via-yellow-400 to-amber-500 text-slate-950 font-bold hover:brightness-110 shadow-md shadow-brand-amber/20 transition-all text-xs sm:text-sm text-center"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
