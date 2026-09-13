'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEmail, setUserEmail] = useState<string>('checknextip@gmail.com');
  const [userPlan, setUserPlan] = useState<string>('max');
  const [userRole, setUserRole] = useState<string>('admin');

  useEffect(() => {
    // 1. Check local storage
    const storedUserStr = localStorage.getItem('socialone_user');
    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.plan) setUserPlan(parsed.plan);
        if (parsed.role) setUserRole(parsed.role);
      } catch {}
    }

    // 2. Fetch authenticated session from /api/auth/me
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUserEmail(data.user.email);
          if (data.user.plan) setUserPlan(data.user.plan);
          if (data.user.role) setUserRole(data.user.role);
          localStorage.setItem('socialone_user', JSON.stringify(data.user));
        }
      })
      .catch(err => console.error('Erro ao buscar usuario autenticado:', err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('socialone_user');
    window.location.href = '/';
  };

  const getInitials = (email: string) => {
    if (!email) return 'SO';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-screen w-screen bg-[#0B132B] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Bar Navigation */}
      <header className="h-14 bg-[#070B1B] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo-icon.png" 
              alt="Social One" 
              className="h-9 w-9 object-contain group-hover:scale-105 transition-transform" 
            />
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-300">
              Social One
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FACC15] px-2.5 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 hidden sm:inline-block">
            Painel Corporativo
          </span>
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full hidden lg:flex items-center space-x-1 hover:bg-purple-500/30 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Painel Admin</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-5">
          <a
            href="https://socialoneapp.com.br"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 hover:text-[#FACC15] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">socialoneapp.com.br</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
            <div className="flex items-center space-x-2 bg-[#111936] border border-slate-800 px-3 py-1 rounded-xl text-xs">
              <div className="w-5 h-5 rounded-full bg-[#581C87] flex items-center justify-center font-bold text-white text-[9px]">
                {getInitials(userEmail)}
              </div>
              <span className="text-slate-300 font-medium text-xs hidden md:inline">{userEmail}</span>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 bg-brand-violet/20 text-brand-lavender rounded border border-brand-violet/30 hidden lg:inline">
                {userPlan}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-900"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 w-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}

