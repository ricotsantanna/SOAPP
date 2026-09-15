import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recursos da Plataforma',
  description: 'Descubra como a automação via WhatsApp, integração com Instagram Direct, base de conhecimento RAG e modelo BYOAI transformam seu atendimento.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/recursos',
  },
  openGraph: {
    title: 'Recursos da Plataforma | Social One',
    description: 'Descubra como a automação via WhatsApp, integração com Instagram Direct, base de conhecimento RAG e modelo BYOAI transformam seu atendimento.',
    url: 'https://www.socialoneapp.com.br/recursos',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RecursosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
