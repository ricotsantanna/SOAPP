import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre a Social One',
  description: 'Conheça a missão da Social One de democratizar a inteligência artificial corporativa com autonomia financeira e atendimento de excelência.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/sobre',
  },
  openGraph: {
    title: 'Sobre a Social One | Plataforma de IA Corporativa',
    description: 'Conheça a missão da Social One de democratizar a inteligência artificial corporativa com autonomia financeira e atendimento de excelência.',
    url: 'https://www.socialoneapp.com.br/sobre',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
