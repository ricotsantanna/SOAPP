import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

/**
 * GET /api/setup
 * Initializes the database tables.
 * Run this once after connecting the PostgreSQL database.
 */
export async function GET() {
  try {
    const result = await initDb();
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: '✅ Banco de dados inicializado com sucesso! Todas as tabelas foram criadas. Você já pode salvar suas configurações.' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao inicializar banco. Verifique se POSTGRES_URL está configurado no Vercel.',
        details: String(result.error)
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Erro desconhecido',
      hint: 'Certifique-se que POSTGRES_URL foi adicionado nas variáveis de ambiente do Vercel e que o projeto foi reimplantado.'
    }, { status: 500 });
  }
}
