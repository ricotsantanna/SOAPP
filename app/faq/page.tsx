'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, Bot } from 'lucide-react';
import Header from '../components/Header';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "Como funciona o modelo BYOAI (Bring Your Own AI)?",
    answer: "Você usa sua própria chave de API da OpenAI ou Google Gemini dentro da plataforma. O Social One não cobra por mensagem processada pela IA — você paga apenas a mensalidade do software e o custo direto da sua chave junto ao provedor de IA escolhido."
  },
  {
    question: "Preciso saber programar para conectar o WhatsApp?",
    answer: "Não. A conexão é feita escaneando um QR Code pelo WhatsApp Business, de forma parecida com o WhatsApp Web. Leva poucos segundos e não exige conhecimento técnico."
  },
  {
    question: "A IA consegue responder sobre os produtos e serviços da minha empresa especificamente?",
    answer: "Sim. Você pode enviar PDFs e documentos do Google Drive para a Base de Conhecimento (RAG). A IA usa esse conteúdo para responder perguntas específicas do seu negócio, em vez de dar respostas genéricas."
  },
  {
    question: "Consigo assumir a conversa manualmente se precisar?",
    answer: "Sim, a qualquer momento. O recurso de Human Handoff permite pausar a IA e responder você mesmo, sem que o cliente perceba a transição."
  },
  {
    question: "Qual a diferença entre os planos Start, Agenda IA e Social One Full?",
    answer: "O Start cobre atendimento automático 24/7 no WhatsApp com BYOAI e base de conhecimento. O Agenda IA inclui tudo do Start e adiciona agendamento inteligente integrado ao Google Calendar, com confirmação automática de consultas. O Social One Full inclui tudo do Agenda IA e adiciona Instagram Direct, CRM avançado com pipeline de vendas e estúdio de conteúdo com IA."
  },
  {
    question: "Quantos números de WhatsApp posso conectar em cada plano?",
    answer: "Os planos Start e Agenda IA incluem 1 número de WhatsApp. O plano Social One Full permite conectar até 2 números."
  },
  {
    question: "Existe multa ou fidelidade para cancelar?",
    answer: "Não há multa de fidelidade. Você pode cancelar quando quiser. Ao cancelar (ou se o pagamento for interrompido), o acesso à plataforma é suspenso, mas não há cobrança adicional pelo cancelamento em si."
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: "Se você cancelar dentro dos primeiros 7 dias após a contratação, devolvemos o valor pago integralmente."
  },
  {
    question: "Meus dados e os dados dos meus clientes ficam seguros?",
    answer: "Seguimos os princípios da LGPD nas práticas de tratamento de dados: coleta mínima de informações, política de privacidade clara e possibilidade de exclusão de dados mediante solicitação. A plataforma ainda não passou por certificação formal de terceiros, como ISO/IEC 27701. Sobre sua chave de API (OpenAI/Gemini): ela é criptografada (AES) antes de ser armazenada e não é exibida em nenhuma tela, painel administrativo ou API — nem mesmo a equipe interna tem acesso a ela em texto puro no uso normal da plataforma."
  },
  {
    question: "Funciona para Instagram também, ou só WhatsApp?",
    answer: "O Instagram Direct (mensagens e respostas em comentários) está disponível no plano Social One Full. Os planos Start e Agenda IA cobrem apenas WhatsApp."
  },
  {
    question: "O site usa cookies de rastreamento ou marketing?",
    answer: "Não. Utilizamos apenas um cookie essencial de sessão, necessário para manter você autenticado no painel. Não usamos Google Analytics, Meta Pixel ou qualquer ferramenta de rastreamento de terceiros no momento."
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-lavender text-xs font-bold mb-4 shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
            <span>Central de Ajuda & Dúvidas Frequentes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Perguntas Frequentes
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Tudo o que você precisa saber sobre a plataforma, planos, modelo BYOAI e funcionamento do sistema.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-violet/40 transition-all"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-100 text-sm sm:text-base hover:text-white transition-colors focus:outline-none"
                >
                  <span className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-brand-amber shrink-0" />
                    <span>{item.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-lavender shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1 pt-4 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-violet/20 bg-slate-950 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-violet" />
            <span className="font-bold text-slate-200">Social One</span>
            <span>— socialoneapp.com.br</span>
          </div>
          <div className="flex items-center space-x-6 flex-wrap justify-center gap-y-2">
            <Link href="/sobre" className="hover:text-brand-amber transition-colors">Sobre a Plataforma</Link>
            <Link href="/faq" className="hover:text-brand-amber transition-colors">Perguntas Frequentes (FAQ)</Link>
            <Link href="/contato" className="hover:text-brand-amber transition-colors">Contato</Link>
            <Link href="/privacidade" className="hover:text-brand-amber transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-brand-amber transition-colors">Termos de Uso</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
