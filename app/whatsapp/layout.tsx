import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automação WhatsApp com Evolution API',
  description: 'Conecte seu WhatsApp Business em segundos via QR Code. Atendimento automático humanizado 24/7 com suporte a Human Handoff.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/whatsapp',
  },
  openGraph: {
    title: 'Automação WhatsApp com Evolution API | Social One',
    description: 'Conecte seu WhatsApp Business em segundos via QR Code. Atendimento automático humanizado 24/7 com suporte a Human Handoff.',
    url: 'https://www.socialoneapp.com.br/whatsapp',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function WhatsappLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
