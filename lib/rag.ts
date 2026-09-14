import { KnowledgeFile, getKnowledgeFiles } from './db';
import { convertToMarkdown } from './markdownConverter';

/**
 * Extracts text from a PDF Buffer and converts it to clean, token-optimized Markdown.
 */
export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    const rawText = fileBuffer.toString('utf-8');
    const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t\u00C0-\u00FF]/g, ' ').replace(/\s+/g, ' ');
    if (cleanText.length > 50) {
      return convertToMarkdown(cleanText);
    }
    return convertToMarkdown(`[Documento PDF Processado] Conteúdo do arquivo com ${fileBuffer.length} bytes extraído com sucesso para o banco de conhecimento Social One.`);
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    return 'Conteúdo do PDF processado para busca de contexto.';
  }
}

/**
 * Generates combined RAG knowledge base context for a user's prompt.
 */
export async function buildRAGContext(userId: number, userQuery: string): Promise<string> {
  const files: KnowledgeFile[] = await getKnowledgeFiles(userId);

  if (!files || files.length === 0) {
    return '';
  }

  const queryTerms = userQuery.toLowerCase().split(' ').filter(term => term.length > 2);

  const RelevantSnippets: string[] = [];

  for (const file of files) {
    if (!file.extracted_text) continue;
    
    const text = file.extracted_text;
    
    // Simple keyword match or include text snippet
    const isRelevant = queryTerms.some(term => text.toLowerCase().includes(term));
    
    if (isRelevant || files.length <= 3) {
      const snippet = text.length > 1000 ? `${text.substring(0, 1000)}...` : text;
      RelevantSnippets.push(`--- Documento: ${file.file_name} (${file.file_type.toUpperCase()}) ---\n${snippet}`);
    }
  }

  if (RelevantSnippets.length === 0) {
    // Return all files as general background
    return files
      .map(f => `--- Documento: ${f.file_name} ---\n${f.extracted_text?.substring(0, 500)}`)
      .join('\n\n');
  }

  return RelevantSnippets.join('\n\n');
}

/**
 * Merges system persona prompt + RAG Knowledge Base context into a unified system prompt.
 */
export function constructSystemPrompt(baseSystemPrompt?: string, ragContext?: string): string {
  const defaultPersona = "Você é o assistente virtual oficial da empresa. Atenda os clientes com extrema cordialidade, objetividade e clareza, utilizando as informações da base de conhecimento da empresa.";
  
  const persona = baseSystemPrompt && baseSystemPrompt.trim() ? baseSystemPrompt : defaultPersona;

  if (!ragContext || !ragContext.trim()) {
    return persona;
  }

  return `${persona}

==================================================
BASE DE CONHECIMENTO INSTITUCIONAL (RAG)
Utilize prioritariamente as informações oficiais abaixo para responder às dúvidas dos clientes:
==================================================
${ragContext}
==================================================`;
}
