'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, LogOut, Globe, ExternalLink } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-[#0B132B] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Bar Navigation */}
      <header className="h-14 bg-[#070B1B] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#581C87] to-[#86198F] flex items-center justify-center shadow-md shadow-purple-900/40">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">Social One</span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FACC15] px-2 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30">
            Painel Corporativo
          </span>
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
                SO
              </div>
              <span className="text-slate-300 font-medium text-xs hidden md:inline">demo@socialoneapp.com.br</span>
            </div>

            <Link
              href="/"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-900"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Link>
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
