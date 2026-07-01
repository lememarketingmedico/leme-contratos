import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateContractPdf } from '@/lib/contractPdf';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', _request.url), { status: 303 });
  }

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: { client: true, preset: true }
  });

  if (!contract) {
    return new NextResponse('Contrato não encontrado', { status: 404 });
  }

  const company = await prisma.companyConfig.findFirst();
  if (!company) {
    return new NextResponse('Configurações da LEME não encontradas', { status: 500 });
  }

  const buffer = await generateContractPdf({
    ...contract,
    company
  });

  const filename = `${contract.number}-${contract.client.name}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
