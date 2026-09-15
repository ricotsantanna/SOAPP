import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Compare os planos Start, Agenda IA e Social One Full. Sem taxas escondidas, custos previsíveis e garantia de 7 dias.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/planos',
  },
  openGraph: {
    title: 'Planos e Preços | Social One',
    description: 'Compare os planos Start, Agenda IA e Social One Full. Sem taxas escondidas, custos previsíveis e garantia de 7 dias.',
    url: 'https://www.socialoneapp.com.br/planos',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
