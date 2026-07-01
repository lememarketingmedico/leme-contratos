import { NextResponse } from 'next/server';
import { generateBasicPdf } from '../../../../lib/contractPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const buffer = await generateBasicPdf('Teste de PDF');
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="teste-pdf-leme.pdf"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('[LEME Contratos] Erro no PDF de teste:', error);
    return new NextResponse(`Erro no PDF de teste: ${error instanceof Error ? error.message : String(error)}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
