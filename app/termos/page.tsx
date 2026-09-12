'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  FileCheck2, 
  ShieldAlert, 
  RefreshCw, 
  Scale, 
  CheckCircle2 
} from 'lucide-react';

import Header from '../components/Header';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4">
            <FileCheck2 className="w-4 h-4 text-brand-amber" />
            <span>Contrato de Licença de Uso do Software</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Termos de Uso e Serviço
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Última atualização: 12 de Setembro de 2026 — Social One App
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-brand-violet/30 space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-brand-amber shrink-0" />
              <span>1. Aceitação dos Termos</span>
            </h2>
            <p>
              Ao cadastrar-se, acessar ou contratar qualquer um dos Planos SaaS da plataforma <strong>Social One</strong>, você concorda expressamente em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Caso não concorde com qualquer disposição, você não deve utilizar a plataforma.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-brand-lavender shrink-0" />
              <span>2. Descrição dos Serviços & Modelo BYOAI</span>
            </h2>
            <p>
              O <strong>Social One</strong> é uma plataforma SaaS que disponibiliza ferramentas para automação de atendimento corporativo, integração com WhatsApp Evolution API, Instagram Direct DMs, Google Calendar SSOT e Base de Conhecimento RAG.
            </p>
            <p>
              <strong>Modelo BYOAI:</strong> O contratante compreende que a plataforma opera fornecendo o software de automação e que o consumo das inferências de Inteligência Artificial exige o fornecimento de uma chave API própria (OpenAI ou Google Gemini). O custo direto dos tokens consumidos junto a esses provedores é de responsabilidade exclusiva do usuário.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>3. Pagamentos, Assinaturas & Reembolso</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <td><strong>Assinatura Recorrente:</strong> Os planos (Start, Agenda IA e Social One) possuem cobrança recorrente (mensal ou anual) processada via Mercado Pago.</td>
              <td><strong>Sem Fidelidade Forçada:</strong> O usuário pode cancelar a renovação da sua assinatura a qualquer momento através do painel.</td>
              <td><strong>Garantia de 7 dias:</strong> Conforme o Código de Defesa do Consumidor, oferecemos reembolso integral do valor da assinatura SaaS caso o cancelamento seja solicitado nos primeiros 7 dias após a contratação.</td>
            </ul>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>4. Uso Aceitável e Regras Anti-Spam</span>
            </h2>
            <p>
              É estritamente proibido utilizar a plataforma Social One para:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <td>Envio de mensagens não solicitadas em massa (Spam) em desacordo com os Termos de Serviço do WhatsApp / Meta.</td>
              <td>Disseminação de conteúdos ilícitos, difamatórios, fraudulentos ou maliciosos.</td>
              <td>Tentativas de engenharia reversa, invasão ou comprometimento da estabilidade da infraestrutura SaaS.</td>
            </ul>
            <p className="text-xs text-red-300 font-semibold mt-2">
              A violação destas regras resultará no bloqueio imediato da conta sem direito a reembolso.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
              <span>5. Legislação Aplicável e Foro</span>
            </h2>
            <p>
              Estes Termos são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Quaisquer disputas relativas ao uso do serviço serão submetidas ao Foro da Comarca do Rio de Janeiro - RJ.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-violet/20 bg-slate-950 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-violet" />
            <span className="font-bold text-slate-200">Social One</span>
            <span>— socialoneapp.com.br</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/sobre" className="hover:text-white transition-colors">Sobre a Plataforma</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="text-brand-amber font-semibold">Termos de Uso</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
