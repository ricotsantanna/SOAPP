import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fale com a Social One',
  description: 'Entre em contato com nossa equipe de especialistas. Tiramos suas dúvidas sobre integração, planos e suporte ao cliente.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/contato',
  },
  openGraph: {
    title: 'Fale com a Social One | Suporte e Atendimento',
    description: 'Entre em contato com nossa equipe de especialistas. Tiramos suas dúvidas sobre integração, planos e suporte ao cliente.',
    url: 'https://www.socialoneapp.com.br/contato',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
