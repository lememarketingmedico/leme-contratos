'use server';

import { ContractStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/db';
import { onlyDate, parseMoneyToCents, valueToWordsBRL } from '../lib/format';
import { DEFAULT_CONTRACT_TEMPLATE_HTML } from '../lib/contractHtml';
import { requireUser } from '../lib/auth';

function field(formData: FormData, name: string) {
  return String(formData.get(name) || '').trim();
}

function optionalField(formData: FormData, name: string) {
  const value = field(formData, name);
  return value || null;
}

function numberField(formData: FormData, name: string, fallback = 0) {
  const value = Number(field(formData, name));
  return Number.isFinite(value) ? value : fallback;
}

const defaultServiceDescription =
  'gerenciamento de redes sociais, criação, desenvolvimento e manutenção de website, captação de imagens e conteúdos audiovisuais, gestão de tráfego pago, planejamento estratégico, produção de conteúdos digitais e demais atividades correlatas necessárias à execução da estratégia comercial e publicitária da CONTRATANTE';

export async function createContractAction(formData: FormData) {
  await requireUser();

  const clientName = field(formData, 'clientName');
  if (!clientName) throw new Error('Nome do cliente é obrigatório.');

  const clientDocument = optionalField(formData, 'clientDocument');
  const clientPayload = {
    name: clientName,
    personType: optionalField(formData, 'personType'),
    document: clientDocument,
    representative: optionalField(formData, 'representative'),
    address: optionalField(formData, 'clientAddress'),
    city: optionalField(formData, 'clientCity'),
    state: optionalField(formData, 'clientState'),
    email: optionalField(formData, 'clientEmail'),
    phone: optionalField(formData, 'clientPhone'),
    notes: optionalField(formData, 'clientNotes')
  };

  let client = null;
  if (clientDocument) {
    client = await prisma.client.findFirst({ where: { document: clientDocument } });
  }

  if (client) {
    client = await prisma.client.update({ where: { id: client.id }, data: clientPayload });
  } else {
    client = await prisma.client.create({ data: clientPayload });
  }

  const startDate = onlyDate(field(formData, 'startDate'));
  const endDate = onlyDate(field(formData, 'endDate'));
  const signatureDate = onlyDate(field(formData, 'signatureDate'));
  const monthlyValueCents = parseMoneyToCents(field(formData, 'monthlyValue'));
  const monthlyValueTextInput = optionalField(formData, 'monthlyValueText');
  const dueDay = numberField(formData, 'dueDay', 10);
  const presetId = optionalField(formData, 'presetId');

  const currentYear = new Date().getFullYear();
  const count = await prisma.contract.count();
  const number = `LEME-${currentYear}-${String(count + 1).padStart(4, '0')}`;

  const contract = await prisma.contract.create({
    data: {
      number,
      clientId: client.id,
      presetId,
      status: 'GENERATED',
      serviceTitle: field(formData, 'serviceTitle') || 'Prestação de serviços de marketing digital',
      serviceDescription: field(formData, 'serviceDescription') || defaultServiceDescription,
      startDate,
      endDate,
      monthlyValueCents,
      monthlyValueText: monthlyValueTextInput || valueToWordsBRL(monthlyValueCents),
      dueDay,
      citySignature: field(formData, 'citySignature') || 'Araguari/MG',
      signatureDate,
      notes: optionalField(formData, 'contractNotes')
    }
  });

  revalidatePath('/contratos');
  revalidatePath('/dashboard');
  redirect(`/contratos/${contract.id}`);
}

export async function updateContractStatusAction(formData: FormData) {
  await requireUser();
  const id = field(formData, 'id');
  const status = field(formData, 'status') as ContractStatus;

  await prisma.contract.update({ where: { id }, data: { status } });

  revalidatePath('/contratos');
  revalidatePath(`/contratos/${id}`);
  redirect(`/contratos/${id}`);
}

export async function saveCompanyConfigAction(formData: FormData) {
  await requireUser();
  const id = optionalField(formData, 'id');
  const data = {
    companyName: field(formData, 'companyName') || '62.641.373 MATHEUS ISSAO RIBEIRO ADATI',
    tradeName: optionalField(formData, 'tradeName') || 'Leme Marketing Médico',
    document: optionalField(formData, 'document'),
    address: optionalField(formData, 'address'),
    city: optionalField(formData, 'city'),
    state: optionalField(formData, 'state'),
    email: optionalField(formData, 'email'),
    phone: optionalField(formData, 'phone'),
    pix: optionalField(formData, 'pix'),
    bankInfo: optionalField(formData, 'bankInfo'),
    logoPath: '/logo-leme.png',
    defaultForoCity: optionalField(formData, 'defaultForoCity'),
    signatureLabel: optionalField(formData, 'signatureLabel') || 'LEME MARKETING MÉDICO',
    contractTemplateHtml: optionalField(formData, 'contractTemplateHtml') || DEFAULT_CONTRACT_TEMPLATE_HTML
  };

  if (id) {
    await prisma.companyConfig.update({ where: { id }, data });
  } else {
    await prisma.companyConfig.create({ data });
  }

  revalidatePath('/configuracoes');
  redirect('/configuracoes?salvo=1');
}

export async function savePresetAction(formData: FormData) {
  await requireUser();
  const id = optionalField(formData, 'id');
  const name = field(formData, 'name');
  const fullName = field(formData, 'fullName');

  if (!name || !fullName) throw new Error('Nome da predefinição e nome completo são obrigatórios.');

  const data = {
    name,
    fullName,
    document: optionalField(formData, 'document'),
    email: optionalField(formData, 'email'),
    phone: optionalField(formData, 'phone'),
    address: optionalField(formData, 'address'),
    city: optionalField(formData, 'city'),
    state: optionalField(formData, 'state'),
    signatureTitle: optionalField(formData, 'signatureTitle'),
    pix: optionalField(formData, 'pix'),
    bankInfo: optionalField(formData, 'bankInfo'),
    active: field(formData, 'active') === 'on'
  };

  if (id) {
    await prisma.preset.update({ where: { id }, data });
  } else {
    await prisma.preset.create({ data });
  }

  revalidatePath('/predefinicoes');
  redirect('/predefinicoes?salvo=1');
}
