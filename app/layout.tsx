import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.socialoneapp.com.br'),
  title: {
    default: 'Social One - Automação de Atendimento com IA no WhatsApp',
    template: '%s | Social One',
  },
  description: 'Atenda clientes 24/7 no WhatsApp com IA, sem taxa por mensagem. Modelo BYOAI: use sua própria chave e tenha controle total de custo.',
  keywords: ['Social One', 'Automação WhatsApp', 'BYOAI', 'RAG', 'Atendimento IA', 'Evolution API', 'Chatbot WhatsApp', 'Gestão de Redes Sociais'],
  authors: [{ name: 'Social One' }],
  creator: 'Social One',
  publisher: 'Social One',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br',
  },
  openGraph: {
    title: 'Social One - Automação de Atendimento com IA no WhatsApp',
    description: 'Atenda clientes 24/7 no WhatsApp com IA, sem taxa por mensagem. Modelo BYOAI: use sua própria chave e tenha controle total de custo.',
    url: 'https://www.socialoneapp.com.br',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${plusJakartaSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${plusJakartaSans.className} bg-brand-navy text-slate-100 min-h-screen selection:bg-brand-violet selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
