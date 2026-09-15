import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Saiba como protegemos seus dados e garantimos a privacidade corporativa da sua empresa de acordo com a LGPD no Social One.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/privacidade',
  },
  openGraph: {
    title: 'Política de Privacidade | Social One',
    description: 'Saiba como protegemos seus dados e garantimos a privacidade corporativa da sua empresa de acordo com a LGPD no Social One.',
    url: 'https://www.socialoneapp.com.br/privacidade',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function PrivacidadeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
