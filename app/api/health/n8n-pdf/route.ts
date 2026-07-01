import { NextResponse } from 'next/server';
import { htmlToPdfViaN8n, isN8nPdfConfigured } from '../../../../lib/n8nPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function pdfResponse(buffer: Buffer) {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="teste-n8n-gotenberg-leme.pdf"',
      'Cache-Control': 'no-store'
    }
  });
}

export async function GET() {
  try {
    if (!isN8nPdfConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          message: 'N8N_PDF_WEBHOOK_URL não está configurada no contratos-web.'
        },
        { status: 500 }
      );
    }

    const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><style>@page{size:A4;margin:20mm}body{font-family:Arial,sans-serif;color:#111827}.box{border:2px solid #183850;padding:24px;border-radius:12px}h1{color:#183850}</style></head>
<body><div class="box"><h1>LEME Contratos</h1><p>Se você baixou este PDF, o fluxo n8n + Gotenberg está funcionando.</p><p>Gerado em ${new Date().toLocaleString('pt-BR')}.</p></div></body>
</html>`;

    const buffer = await htmlToPdfViaN8n({
      html,
      filename: 'teste-n8n-gotenberg-leme',
      meta: { test: true }
    });

    return pdfResponse(buffer);
  } catch (error) {
    return new NextResponse(
      `Erro no teste n8n/Gotenberg.\n\n${error instanceof Error ? error.message : String(error)}`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
      }
    );
  }
}
