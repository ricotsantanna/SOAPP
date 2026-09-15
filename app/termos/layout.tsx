import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Leia os termos de uso do serviço Social One. Condições transparentes para contratação, uso da plataforma e garantias.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/termos',
  },
  openGraph: {
    title: 'Termos de Uso | Social One',
    description: 'Leia os termos de uso do serviço Social One. Condições transparentes para contratação, uso da plataforma e garantias.',
    url: 'https://www.socialoneapp.com.br/termos',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function TermosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
