import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes',
  description: 'Tire suas dúvidas sobre automação de WhatsApp com IA, modelo BYOAI, planos, cancelamento e segurança de dados do Social One.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/faq',
  },
  openGraph: {
    title: 'Perguntas Frequentes | Social One',
    description: 'Tire suas dúvidas sobre automação de WhatsApp com IA, modelo BYOAI, planos, cancelamento e segurança de dados do Social One.',
    url: 'https://www.socialoneapp.com.br/faq',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
