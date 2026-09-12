import { NextResponse } from 'next/server';
import { getKnowledgeFiles, saveKnowledgeFile, deleteKnowledgeFile } from '@/lib/db';
import { extractTextFromPDF } from '@/lib/rag';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 1);

    const files = await getKnowledgeFiles(userId);
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching knowledge files:', error);
    return NextResponse.json({ error: 'Erro ao buscar base de conhecimento' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let userId = 1;
    let fileName = 'Documento_Upload.pdf';
    let extractedText = '';
    let fileSize = '1.0 MB';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const userIdParam = formData.get('userId');
      if (userIdParam) userId = Number(userIdParam);

      if (file) {
        fileName = file.name;
        fileSize = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
        const buffer = Buffer.from(await file.arrayBuffer());
        extractedText = await extractTextFromPDF(buffer);
      }
    } else {
      const body = await req.json();
      userId = body.userId || 1;
      fileName = body.fileName || fileName;
      extractedText = body.extractedText || 'Conteúdo do documento indexado para inteligência artificial RAG.';
    }

    const newFile = {
      user_id: userId,
      file_name: fileName,
      file_type: 'pdf' as const,
      extracted_text: extractedText,
    };

    await saveKnowledgeFile(newFile);

    return NextResponse.json({
      success: true,
      file: {
        id: Date.now(),
        name: fileName,
        type: 'PDF',
        size: fileSize
      }
    });
  } catch (error) {
    console.error('Error saving knowledge file:', error);
    return NextResponse.json({ error: 'Erro ao processar PDF para base de conhecimento' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const userId = Number(searchParams.get('userId') || 1);

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await deleteKnowledgeFile(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge file:', error);
    return NextResponse.json({ error: 'Erro ao excluir documento' }, { status: 500 });
  }
}
