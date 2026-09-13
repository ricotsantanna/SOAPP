'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X 
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'register') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      window.location.href = `/login?mode=${mode}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-brand-violet/20 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Official Image Logo & Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo-icon.png" 
            alt="Social One Logo" 
            className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(134,25,143,0.5)]"
          />
          <div className="flex items-center">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-lavender">
              Social One
            </span>
            <span className="hidden sm:inline-flex text-[10px] uppercase font-extrabold tracking-widest text-brand-amber ml-2.5 px-2.5 py-0.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
              SaaS Enterprise
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <Link
            href="/planos"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-amber via-yellow-400 to-amber-500 hover:brightness-110 transition-all flex items-center space-x-1.5 shadow-md shadow-brand-amber/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>Planos SaaS ✨</span>
          </Link>
          <Link
            href="/recursos"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Recursos
          </Link>
          <Link
            href="/byoai"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Modelo BYOAI
          </Link>
          <Link
            href="/rag"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Base de Conhecimento
          </Link>
          <Link
            href="/whatsapp"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            WhatsApp API
          </Link>
        </nav>

        {/* Header Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={() => handleAuthClick('login')}
            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700/60 hover:border-brand-violet/50 hover:bg-slate-900/60 transition-all"
          >
            Entrar na minha conta
          </button>
          <button
            onClick={() => handleAuthClick('register')}
            className="bg-brand-amber text-slate-950 font-extrabold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-brand-amber/20 flex items-center space-x-2 text-xs"
          >
            <span>Criar conta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-brand-amber" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 bg-slate-900/95 border border-brand-violet/30 rounded-2xl backdrop-blur-2xl shadow-2xl flex flex-col space-y-3 animate-fadeIn">
          <Link
            href="/planos"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-brand-amber to-yellow-400 flex items-center justify-between shadow-md"
          >
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Planos SaaS</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-brand-amber rounded-full font-bold uppercase">
              Ver Preços
            </span>
          </Link>
          <Link
            href="/recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="/byoai"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
          >
            Modelo BYOAI
          </Link>
          <Link
            href="/rag"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
          >
            Base de Conhecimento
          </Link>
          <Link
            href="/whatsapp"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
          >
            WhatsApp API
          </Link>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); handleAuthClick('login'); }}
              className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs text-center"
            >
              Entrar na minha conta
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); handleAuthClick('register'); }}
              className="w-full py-3 rounded-xl bg-brand-amber text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-brand-amber/20"
            >
              <span>Criar conta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
