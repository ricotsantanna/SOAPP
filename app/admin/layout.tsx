'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  Radio, 
  Sliders, 
  LayoutDashboard, 
  LogOut, 
  ExternalLink,
  Bot,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Visão Geral Executiva',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'KPIs e saúde do SaaS',
    },
    {
      name: 'Clientes & Tenants',
      href: '/admin/users',
      icon: Users,
      description: 'Gestão de usuários e acessos',
    },
    {
      name: 'Instâncias WhatsApp',
      href: '/admin/instances',
      icon: Radio,
      description: 'Monitor global da Evolution API',
    },
    {
      name: 'Configurações Master',
      href: '/admin/settings',
      icon: Sliders,
      description: 'Parâmetros globais da plataforma',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-[#070B1B] border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Admin Logo */}
          <div className="flex items-center space-x-3 px-2 py-3 mb-6 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#86198F] to-[#581C87] flex items-center justify-center shadow-lg shadow-magenta-950/50">
              <ShieldCheck className="w-6 h-6 text-[#FACC15]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">Social One</span>
              <div className="text-[10px] text-[#FACC15] font-mono font-bold uppercase tracking-wider">
                ADMIN CONSOLE
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#86198F] text-white shadow-lg shadow-magenta-950/50 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#111936]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#FACC15]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm">{item.name}</div>
                    <div className="text-[10px] opacity-75">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Client Dashboard */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 px-2 space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#111936] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-[#86198F] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#FACC15]" />
            <span>Voltar ao Dashboard Cliente</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-[#070B1B] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/10 border border-[#FACC15]/30 px-3 py-1 rounded-md">
              Modo Super Administrador
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">admin@socialoneapp.com.br</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
