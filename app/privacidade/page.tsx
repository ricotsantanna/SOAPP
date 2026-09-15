'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Database,
  UserCheck,
  Mail
} from 'lucide-react';

import Header from '../components/Header';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-violet/25 via-brand-magenta/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conformidade LGPD & Segurança AES-256</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Última atualização: 12 de Setembro de 2026 — Social One App
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-brand-violet/30 space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-brand-amber shrink-0" />
              <span>1. Encriptação e Proteção do Modelo BYOAI</span>
            </h2>
            <p>
              A segurança dos seus dados e credenciais é a prioridade máxima do <strong>Social One</strong>. No modelo <strong>Bring Your Own AI (BYOAI)</strong>, suas chaves de API secretas (OpenAI e Google Gemini) são armazenadas no banco de dados com encriptação simétrica <strong>AES-256-GCM</strong>.
            </p>
            <p>
              O Social One <strong>jamais compartilha, vende ou utiliza suas chaves de API</strong> para treinamento de modelos terceiros. As chaves pertencem 100% ao contratante e são consumidas exclusivamente na execução das suas automações corporativas.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-brand-lavender shrink-0" />
              <span>2. Dados Coletados e Finalidade</span>
            </h2>
            <p>Coletamos apenas os dados essenciais para o funcionamento do ecossistema SaaS:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <td><strong>Informações de Cadastro:</strong> Nome, e-mail corporativo e telefone para identificação da conta e autenticação.</td>
              <td><strong>Logs de Mensagens:</strong> Histórico de conversas processadas via WhatsApp e Instagram Direct para exibição no painel CRM e execução do Human Handoff.</td>
              <td><strong>Integração Google Calendar:</strong> Tokens OAuth2 para criação, consulta e gerenciamento autônomo de eventos de agendamento solicitados pelos clientes.</td>
              <td><strong>Documentos RAG:</strong> PDFs e URLs fornecidos pelo usuário para vetorização e recuperação de contexto.</td>
            </ul>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>3. Seus Direitos sob a LGPD (Lei Geral de Proteção de Dados)</span>
            </h2>
            <p>Em atendimento à Lei nº 13.709/2018 (LGPD), você possui total controle sobre seus dados pessoais:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <td>Direito de confirmação e acesso aos dados armazenados.</td>
              <td>Direito de retificação de dados incompletos ou desatualizados.</td>
              <td>Direito de exclusão definitiva de histórico de mensagens, documentos RAG e chaves API a qualquer momento via painel de configurações.</td>
              <td>Portabilidade dos dados do seu workspace em formato estruturado.</td>
            </ul>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-sky-400 shrink-0" />
              <span>4. Processamento de Pagamentos</span>
            </h2>
            <p>
              Os pagamentos dos Planos SaaS no Social One são processados de forma 100% segura via <strong>Mercado Pago</strong>. O Social One não armazena números de cartão de crédito em seus servidores; todas as transações financeiras são criptografadas diretamente pelo gateway de pagamento oficial.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 5 - Cookies & Analytics */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-brand-amber shrink-0" />
              <span>5. Cookies e Ferramentas de Análise (Google Analytics 4)</span>
            </h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento adequado da plataforma e analisar o tráfego do site:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong>Cookies Essenciais:</strong> Mantêm sua sessão ativa e segura no painel. Não podem ser desativados pois são necessários para a prestação do serviço.
              </li>
              <li>
                <strong>Google Analytics 4 (GA4):</strong> Utilizado para coletar métricas de uso agregadas e estatísticas anônimas de navegação (páginas visitadas, tempo de permanência). Os scripts do GA4 <strong>somente são ativados após o seu consentimento prévio e explícito</strong> no banner de cookies.
              </li>
            </ul>
            <p>
              Você pode aceitar ou recusar os cookies não essenciais no banner de consentimento na sua primeira visita. Caso deseje revogar ou alterar sua preferência a qualquer momento, basta limpar os dados de armazenamento do site (localStorage e cookies) nas configurações do seu navegador.
            </p>
          </section>

          <div className="w-full h-px bg-slate-800" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-brand-amber shrink-0" />
              <span>6. Encarregado de Dados (DPO) & Contato</span>
            </h2>
            <p>
              Para solicitar alterações, revogação de consentimento ou esclarecer dúvidas sobre esta política, entre em contato com nosso encarregado de privacidade:
            </p>
            <p className="font-bold text-white">
              E-mail DPO: <a href="mailto:dpo@socialoneapp.com.br" className="text-brand-amber underline">dpo@socialoneapp.com.br</a>
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
            <Link href="/privacidade" className="text-brand-amber font-semibold">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Social One. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
