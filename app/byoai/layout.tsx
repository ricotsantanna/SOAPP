import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O que é BYOAI (Bring Your Own AI)',
  description: 'Entenda a arquitetura BYOAI: conecte sua própria chave OpenAI ou Gemini, elimine intermediários e pague zero taxa por mensagem enviada.',
  alternates: {
    canonical: 'https://www.socialoneapp.com.br/byoai',
  },
  openGraph: {
    title: 'O que é BYOAI (Bring Your Own AI) | Social One',
    description: 'Entenda a arquitetura BYOAI: conecte sua própria chave OpenAI ou Gemini, elimine intermediários e pague zero taxa por mensagem enviada.',
    url: 'https://www.socialoneapp.com.br/byoai',
    siteName: 'Social One',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ByoaiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
