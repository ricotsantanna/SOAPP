/**
 * Markdown Converter & Token Optimizer for Social One RAG Knowledge Base.
 * Converts raw PDF text, HTML, and documents into clean, token-efficient Markdown.
 */

export function convertToMarkdown(rawInput: string, title?: string): string {
  if (!rawInput || !rawInput.trim()) {
    return '';
  }

  let text = rawInput;

  // 1. Remove HTML tags scripts and styles if HTML text
  text = text.replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '');

  // Convert basic HTML formatting to Markdown
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  text = text.replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, '\n#### $1\n');
  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  text = text.replace(/<[^>]+>/g, ''); // Strip remaining HTML tags

  // 2. Remove common PDF header/footer artifacts and page numbers (e.g. "Página 1 de 10", "Page 1")
  text = text.replace(/Págin[a|as]\s+\d+(\s+de\s+\d+)?/gi, '');
  text = text.replace(/Page\s+\d+(\s+of\s+\d+)?/gi, '');
  text = text.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, ''); // Standalone dates if cluttering headers

  // 3. Normalize whitespace & blank lines (compress multiple spaces and 3+ newlines to max 2)
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');

  // 4. Format lines into clean Markdown structure
  const lines = text.split('\n');
  const formattedLines: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Detect key-value patterns (e.g. "Preço: R$ 199" -> "**Preço**: R$ 199")
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,25}:\s+\S+/.test(line) && !line.startsWith('http') && !line.startsWith('#')) {
      const parts = line.split(':');
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      line = `**${key}**: ${val}`;
    }

    // Detect capitalized standalone section headers
    else if (line.length < 50 && line === line.toUpperCase() && /^[A-Z0-9\s\-\.\:]{4,}$/.test(line)) {
      line = `\n## ${line.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}\n`;
    }

    formattedLines.push(line);
  }

  let markdown = formattedLines.join('\n');

  // Add document header title if provided
  if (title) {
    markdown = `# ${title}\n\n${markdown}`;
  }

  return markdown.trim();
}

/**
 * Calculates estimated token reduction percentage achieved by Markdown conversion.
 */
export function getTokenSavings(originalText: string, markdownText: string): { originalChars: number; markdownChars: number; savingsPercentage: number } {
  const orig = originalText?.length || 0;
  const md = markdownText?.length || 0;
  if (orig === 0) return { originalChars: 0, markdownChars: 0, savingsPercentage: 0 };
  const savings = Math.max(0, Math.round(((orig - md) / orig) * 100));
  return {
    originalChars: orig,
    markdownChars: md,
    savingsPercentage: savings,
  };
}
