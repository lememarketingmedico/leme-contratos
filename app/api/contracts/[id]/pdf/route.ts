import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { getCurrentUser } from '../../../../../lib/auth';
import { buildContractHtml } from '../../../../../lib/contractHtml';
import { htmlToPdfViaN8n } from '../../../../../lib/n8nPdf';
import { publicUrl } from '../../../../../lib/url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultCompanyConfig = {
  companyName: 'LEME MARKETING MÉDICO',
  document: '62.641.373/0001-07',
  address: 'Rua Zélia Maria Silva Braga, nº 43, Bairro Milenium, CEP 38.447-439',
  city: 'Araguari',
  state: 'MG',
  email: 'agencia.digital.leme@gmail.com',
  phone: '',
  pix: '',
  bankInfo: '',
  logoPath: '/logo-leme.png',
  defaultForoCity: 'Araguari/MG',
  signatureLabel: 'LEME MARKETING MÉDICO'
};

function errorText(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n\n${error.stack || ''}`;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

function safeFilename(number: string, clientName: string) {
  return `${number}-${clientName}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'contrato-leme';
}

function pdfResponse(buffer: Buffer, filename: string) {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(publicUrl('/login', request), { status: 303 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: { client: true, preset: true }
    });

    if (!contract) {
      return new NextResponse('Contrato não encontrado.', { status: 404 });
    }

    let company = await prisma.companyConfig.findFirst();
    if (!company) {
      company = await prisma.companyConfig.create({ data: defaultCompanyConfig });
    }

    const filename = safeFilename(contract.number, contract.client.name);
    const html = buildContractHtml({
      ...contract,
      company
    });

    const buffer = await htmlToPdfViaN8n({
      html,
      filename,
      meta: {
        contractId: contract.id,
        contractNumber: contract.number,
        clientName: contract.client.name,
        generatedBy: user.email
      }
    });

    return pdfResponse(buffer, filename);
  } catch (error) {
    console.error('[LEME Contratos] Erro ao gerar PDF via n8n/Gotenberg:', error);

    return new NextResponse(
      `Erro ao gerar PDF no LEME Contratos via n8n/Gotenberg.\n\nCopie esta mensagem e envie para correção:\n\n${errorText(error)}`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
