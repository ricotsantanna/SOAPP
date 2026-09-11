import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social One - IA e Redes Sociais em um só lugar',
  description: 'Descomplique a automação corporativa e o atendimento ao cliente com IA, BYOAI e WhatsApp em um só lugar.',
  keywords: ['Social One', 'Automação WhatsApp', 'BYOAI', 'RAG', 'Atendimento IA', 'Evolution API'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-brand-navy text-slate-100 min-h-screen selection:bg-brand-violet selection:text-white">
        {children}
      </body>
    </html>
  );
}
