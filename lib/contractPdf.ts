import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { formatCurrencyFromCents, formatLongDate, formatShortDate, valueToWordsBRL } from './format';

type Company = {
  companyName: string;
  document?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  email?: string | null;
  phone?: string | null;
  defaultForoCity?: string | null;
  signatureLabel?: string | null;
};

type Client = {
  name: string;
  document?: string | null;
  representative?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Preset = {
  name: string;
  fullName: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  signatureTitle?: string | null;
} | null;

type ContractData = {
  number: string;
  serviceTitle: string;
  serviceDescription: string;
  startDate: Date;
  endDate: Date;
  monthlyValueCents: number;
  monthlyValueText?: string | null;
  dueDay: number;
  citySignature: string;
  signatureDate: Date;
  notes?: string | null;
  client: Client;
  preset: Preset;
  company: Company;
};

const logoPath = path.join(process.cwd(), 'public', 'logo-leme.png');

function maybe(value?: string | null, fallback = '____________________________') {
  return value && value.trim() ? value.trim() : fallback;
}

function normalizeCityState(city?: string | null, state?: string | null) {
  if (city && state) return `${city}/${state}`;
  return city || state || '';
}

function addHeader(doc: PDFKit.PDFDocument) {
  const pageWidth = doc.page.width;

  doc.save();
  doc.rect(0, 0, pageWidth, 74).fill('#183850');

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 46, 20, { width: 150 });
    } catch {
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text('LEME', 46, 24);
    }
  } else {
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text('LEME', 46, 24);
  }

  doc.fillColor('#ffffff')
    .font('Helvetica')
    .fontSize(8)
    .text('Contrato gerado pela plataforma LEME Contratos', 310, 24, {
      width: 220,
      align: 'right'
    });

  doc.restore();
  doc.fillColor('#111111').font('Times-Roman').fontSize(11);
  doc.x = doc.page.margins.left;
  doc.y = 100;
}

function ensureSpace(doc: PDFKit.PDFDocument, needed = 80) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function paragraph(doc: PDFKit.PDFDocument, text: string) {
  ensureSpace(doc, 55);
  doc.font('Times-Roman').fontSize(11).fillColor('#111111').text(text, {
    align: 'justify',
    lineGap: 4
  });
  doc.moveDown(0.85);
}

function heading(doc: PDFKit.PDFDocument, text: string) {
  ensureSpace(doc, 70);
  doc.moveDown(0.6);
  doc.font('Times-Bold').fontSize(12).fillColor('#111111').text(text, {
    align: 'left'
  });
  doc.moveDown(0.55);
}

function paragraphWithBoldPrefix(doc: PDFKit.PDFDocument, prefix: string, text: string) {
  ensureSpace(doc, 65);
  doc.font('Times-Bold').fontSize(11).fillColor('#111111').text(prefix, { continued: true, lineGap: 4 });
  doc.font('Times-Roman').fontSize(11).text(text, { align: 'justify', lineGap: 4 });
  doc.moveDown(0.85);
}

function signatureBlock(doc: PDFKit.PDFDocument, label: string, sublabel?: string) {
  ensureSpace(doc, 105);
  doc.moveDown(2);
  doc.moveTo(doc.x, doc.y).lineTo(doc.x + 260, doc.y).lineWidth(1).stroke('#111111');
  doc.moveDown(0.5);
  doc.font('Times-Bold').fontSize(11).fillColor('#111111').text(label.toUpperCase());
  if (sublabel) {
    doc.font('Times-Bold').fontSize(10).text(sublabel);
  }
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.font('Helvetica').fontSize(8).fillColor('#666666').text(
      `Página ${i + 1} de ${range.count} | ${new Date().toLocaleDateString('pt-BR')}`,
      0,
      doc.page.height - 35,
      { align: 'center' }
    );
  }
}

export async function generateContractPdf(data: ContractData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      margins: { top: 100, left: 46, right: 46, bottom: 60 },
      info: {
        Title: `Contrato ${data.number} - ${data.client.name}`,
        Author: 'LEME Marketing Médico',
        Subject: data.serviceTitle
      }
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('pageAdded', () => addHeader(doc));

    try {
      addHeader(doc);

    doc.font('Times-Bold').fontSize(16).fillColor('#111111').text(
      'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL',
      { align: 'center' }
    );
    doc.moveDown(1.4);

    const clientCityState = normalizeCityState(data.client.city, data.client.state);
    const companyCityState = normalizeCityState(data.company.city, data.company.state);
    const valueText = data.monthlyValueText?.trim() || valueToWordsBRL(data.monthlyValueCents);

    paragraph(
      doc,
      `Pelo presente instrumento particular de prestação de serviços, de um lado, como CONTRATANTE, ${maybe(data.client.name)}, pessoa jurídica/física inscrita no CPF/CNPJ nº ${maybe(data.client.document)}, com sede/endereço em ${maybe(data.client.address)}${clientCityState ? `, ${clientCityState}` : ''}${data.client.representative ? `, neste ato representada por ${data.client.representative}` : ''}; e, de outro lado, como CONTRATADA, ${maybe(data.company.companyName)}, inscrita no CNPJ nº ${maybe(data.company.document)}, com sede em ${maybe(data.company.address)}${companyCityState ? `, ${companyCityState}` : ''}, têm entre si justo e contratado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL, que se regerá pelas cláusulas e condições seguintes, bem como pelos artigos 593 e seguintes do Código Civil Brasileiro.`
    );

    heading(doc, 'CLÁUSULA PRIMEIRA - DO OBJETO');
    paragraph(
      doc,
      `Constitui objeto do presente contrato a prestação, pela CONTRATADA, de serviços especializados de marketing digital em favor da CONTRATANTE, compreendendo ${data.serviceDescription}.`
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'O presente contrato possui natureza estritamente civil e empresarial, inexistindo qualquer vínculo empregatício entre as partes, responsabilizando-se a CONTRATADA exclusivamente pela forma de execução dos serviços ora ajustados.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'A CONTRATADA compromete-se a empregar seus conhecimentos técnicos e estratégicos na execução dos serviços contratados, não podendo, contudo, garantir resultados específicos, uma vez que o desempenho das campanhas e ações de marketing depende de diversos fatores externos, incluindo condições de mercado, comportamento do público e funcionamento das plataformas digitais.'
    );

    heading(doc, 'CLÁUSULA SEGUNDA - DO PRAZO DE VIGÊNCIA');
    paragraph(
      doc,
      `O presente contrato vigorará pelo prazo determinado de 06 (seis) meses, com início em ${formatShortDate(data.startDate)} e término em ${formatShortDate(data.endDate)}, sendo automaticamente renovado por prazo indeterminado caso não haja manifestação expressa em sentido contrário por qualquer das partes, mediante comunicação formal escrita com antecedência mínima de 30 (trinta) dias da data de encerramento da vigência.`
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo único - ',
      'A ausência de manifestação no prazo acima estipulado implicará renovação automática e integral do presente instrumento.'
    );

    heading(doc, 'CLÁUSULA TERCEIRA - DA REMUNERAÇÃO E FORMA DE PAGAMENTO');
    paragraph(
      doc,
      `Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA o valor mensal de ${formatCurrencyFromCents(data.monthlyValueCents)} (${valueText}), com vencimento todo dia ${String(data.dueDay).padStart(2, '0')} de cada mês, mediante transferência bancária, PIX, boleto ou outro meio previamente ajustado entre as partes.`
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'O inadimplemento acarretará incidência de multa moratória de 2% (dois por cento) sobre o valor devido e juros de mora de 1% (um por cento) ao mês.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'O atraso superior a 15 (quinze) dias autoriza a CONTRATADA, independentemente de aviso prévio, a suspender imediatamente a prestação dos serviços, campanhas, anúncios, acessos, publicações e manutenção de plataformas, sem prejuízo da cobrança judicial ou extrajudicial dos valores pendentes.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo terceiro - ',
      'Os valores referentes a impulsionamentos, anúncios patrocinados, hospedagem de sites, registro de domínio, contratação de plataformas, ferramentas, bancos de imagem, softwares, aplicativos e quaisquer investimentos destinados à execução das campanhas não estão incluídos na remuneração contratual, sendo de responsabilidade exclusiva da CONTRATANTE.'
    );

    heading(doc, 'CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATANTE');
    paragraph(
      doc,
      'Compete à CONTRATANTE fornecer, em tempo hábil, todas as informações, materiais, documentos, aprovações, acessos e conteúdos necessários para a adequada execução dos serviços contratados, responsabilizando-se integralmente pela veracidade das informações disponibilizadas.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'A ausência de envio de materiais, aprovações ou informações pela CONTRATANTE poderá comprometer cronogramas, campanhas e entregas, não gerando qualquer responsabilidade à CONTRATADA.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'A CONTRATANTE obriga-se a efetuar os pagamentos nas datas ajustadas, bem como a manter ativos os acessos, assinaturas e plataformas necessárias à execução dos serviços.'
    );

    heading(doc, 'CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL');
    paragraph(
      doc,
      'Todo o planejamento estratégico, metodologia, estrutura operacional, funis, copys, roteiros, campanhas, materiais publicitários, layouts, artes, estratégias comerciais, anúncios e demais conteúdos intelectuais desenvolvidos pela CONTRATADA constituem propriedade intelectual exclusiva desta, nos termos da legislação aplicável.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'A utilização dos materiais produzidos fica condicionada à regular adimplência contratual.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'Em caso de inadimplemento ou rescisão motivada pela CONTRATANTE, poderá a CONTRATADA suspender campanhas, restringir acessos, interromper publicações e retirar do ar websites, páginas ou materiais vinculados aos serviços prestados até a integral regularização das pendências financeiras.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo terceiro - ',
      'O website eventualmente desenvolvido permanecerá vinculado à CONTRATADA até a quitação integral de todas as obrigações contratuais.'
    );

    heading(doc, 'CLÁUSULA SEXTA - DA APROVAÇÃO DE MATERIAIS');
    paragraph(
      doc,
      'Os materiais, campanhas, conteúdos, artes, legendas, roteiros e demais entregas encaminhadas pela CONTRATADA para aprovação da CONTRATANTE serão considerados automaticamente aprovados caso não haja manifestação em sentido contrário no prazo de 48 (quarenta e oito) horas após o envio.'
    );

    heading(doc, 'CLÁUSULA SÉTIMA - DO USO INSTITUCIONAL E PORTFÓLIO');
    paragraph(
      doc,
      'A CONTRATANTE autoriza a CONTRATADA a utilizar sua marca, nome empresarial, materiais produzidos, campanhas e resultados obtidos para fins institucionais, comerciais e de divulgação de portfólio, inclusive em redes sociais, apresentações comerciais e website da CONTRATADA, salvo manifestação expressa em sentido contrário.'
    );

    heading(doc, 'CLÁUSULA OITAVA - DO CASO FORTUITO E FORÇA MAIOR');
    paragraph(
      doc,
      'Nenhuma das partes será responsabilizada pelo descumprimento de obrigações decorrentes de eventos de caso fortuito ou força maior, nos termos do artigo 393 do Código Civil, incluindo falhas sistêmicas, indisponibilidade de plataformas digitais, ataques cibernéticos, interrupções de internet ou eventos alheios à vontade das partes.'
    );

    heading(doc, 'CLÁUSULA NONA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS');
    paragraph(
      doc,
      'As partes obrigam-se a manter absoluto sigilo acerca de todas as informações técnicas, estratégicas, comerciais, financeiras, operacionais e dados pessoais compartilhados em razão deste contrato, comprometendo-se a não divulgá-los a terceiros sem autorização prévia e expressa.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo único - ',
      'As partes declaram ciência e concordância com as disposições da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD), comprometendo-se a adotar medidas razoáveis de segurança e proteção de dados eventualmente tratados no âmbito da relação contratual.'
    );

    heading(doc, 'CLÁUSULA DÉCIMA - DA RESCISÃO E MULTA CONTRATUAL');
    paragraph(
      doc,
      'O presente contrato poderá ser rescindido por comum acordo entre as partes, por descumprimento contratual ou mediante notificação formal com antecedência mínima de 30 (trinta) dias.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'Em caso de rescisão antecipada imotivada por iniciativa da CONTRATANTE antes do término do período contratual de 06 (seis) meses, ficará esta obrigada ao pagamento de multa compensatória equivalente a 50% (cinquenta por cento) do saldo remanescente do contrato até o término da vigência originalmente pactuada.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'A rescisão não exime a CONTRATANTE do pagamento de valores já vencidos, serviços executados, campanhas ativas, despesas operacionais e investimentos realizados até a data do efetivo encerramento contratual.'
    );

    heading(doc, 'CLÁUSULA DÉCIMA PRIMEIRA - DA LIMITAÇÃO DE RESPONSABILIDADE');
    paragraph(
      doc,
      'A CONTRATADA não poderá ser responsabilizada por bloqueios de contas em redes sociais, alterações de algoritmos, quedas de plataformas, indisponibilidade de sistemas de terceiros, oscilações de mercado, perda de resultados comerciais ou quaisquer prejuízos decorrentes de informações incorretas, omissões ou atrasos imputáveis à CONTRATANTE.'
    );

    heading(doc, 'CLÁUSULA DÉCIMA SEGUNDA - DAS DISPOSIÇÕES GERAIS');
    paragraph(
      doc,
      'A eventual tolerância de qualquer das partes quanto ao descumprimento de cláusulas contratuais será interpretada como mera liberalidade, não constituindo novação, renúncia ou alteração tácita das disposições pactuadas.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo primeiro - ',
      'As comunicações realizadas por e-mail, aplicativos de mensagens, inclusive WhatsApp, ou outros meios eletrônicos utilizados entre as partes serão consideradas válidas para todos os fins de direito.'
    );
    paragraphWithBoldPrefix(
      doc,
      'Parágrafo segundo - ',
      'O presente instrumento obriga as partes, seus herdeiros e sucessores, sendo vedada sua cessão ou transferência sem autorização expressa da outra parte.'
    );

    heading(doc, 'CLÁUSULA DÉCIMA TERCEIRA - DO FORO');
    paragraph(
      doc,
      `Fica eleito o foro da Comarca de ${maybe(data.company.defaultForoCity, 'Araguari/MG')} para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`
    );

    if (data.notes?.trim()) {
      heading(doc, 'OBSERVAÇÕES ADICIONAIS');
      paragraph(doc, data.notes.trim());
    }

    paragraph(
      doc,
      'E, por estarem justas e contratadas, firmam o presente instrumento em 02 (duas) vias de igual teor e forma.'
    );

    doc.moveDown(1);
    doc.font('Times-Roman').fontSize(11).text(`${data.citySignature}, ${formatLongDate(data.signatureDate)}.`);

    signatureBlock(doc, 'CONTRATANTE', data.client.name);
    signatureBlock(doc, data.company.signatureLabel || data.company.companyName, data.company.document ? `CNPJ Nº ${data.company.document}` : undefined);

    if (data.preset) {
      doc.moveDown(0.8);
      doc.font('Times-Roman').fontSize(9).fillColor('#555555').text(
        `Responsável pelo preenchimento: ${data.preset.fullName}${data.preset.signatureTitle ? ` - ${data.preset.signatureTitle}` : ''}. Contrato nº ${data.number}.`
      );
    }

      addPageNumbers(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateBasicPdf(title = 'LEME Contratos'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 72, left: 46, right: 46, bottom: 60 } });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    try {
      doc.rect(0, 0, doc.page.width, 74).fill('#183850');
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text('LEME Contratos', 46, 26);
      doc.fillColor('#111111').font('Helvetica-Bold').fontSize(18).text(title, 46, 110);
      doc.moveDown();
      doc.font('Helvetica').fontSize(12).text('PDF de teste gerado com sucesso pela plataforma LEME Contratos.');
      doc.text(`Data: ${new Date().toLocaleString('pt-BR')}`);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
