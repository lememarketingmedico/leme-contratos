import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.ADMIN_NAME || 'Luis - LEME';
  const adminEmail = process.env.ADMIN_EMAIL || 'agencia.digital.leme@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'LemeLocal@123456';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash, role: 'ADMIN' },
    create: { name: adminName, email: adminEmail, passwordHash, role: 'ADMIN' }
  });

  const company = await prisma.companyConfig.findFirst();
  if (!company) {
    await prisma.companyConfig.create({
      data: {
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
      }
    });
  }

  await prisma.preset.upsert({
    where: { name: 'Luis' },
    update: {},
    create: {
      name: 'Luis',
      fullName: 'Luis',
      document: '',
      email: 'agencia.digital.leme@gmail.com',
      phone: '',
      address: '',
      city: 'Araguari',
      state: 'MG',
      signatureTitle: 'Responsável comercial',
      pix: '',
      bankInfo: '',
      active: true
    }
  });

  await prisma.preset.upsert({
    where: { name: 'Matheus' },
    update: {},
    create: {
      name: 'Matheus',
      fullName: 'Matheus Issao Ribeiro Adati',
      document: '',
      email: 'agencia.digital.leme@gmail.com',
      phone: '',
      address: '',
      city: 'Araguari',
      state: 'MG',
      signatureTitle: 'Responsável comercial',
      pix: '',
      bankInfo: '',
      active: true
    }
  });

  console.log('Seed concluído. Usuário administrador e dados iniciais criados/atualizados.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
