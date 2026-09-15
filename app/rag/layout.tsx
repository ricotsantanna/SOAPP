import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base de Conhecimento com RAG',
  description: 'Treine a IA da sua empresa com PDFs e Google Drive. Conversão automática para Markdown que economiza até 60% dos seus tokens.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/rag',
  },
  openGraph: {
    title: 'Base de Conhecimento com RAG | Social One',
    description: 'Treine a IA da sua empresa com PDFs e Google Drive. Conversão automática para Markdown que economiza até 60% dos seus tokens.',
    url: 'https://www.socialoneapp.com.br/rag',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
