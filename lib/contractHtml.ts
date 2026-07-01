import fs from 'fs';
import path from 'path';
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
  id: string;
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

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function maybe(value?: string | null, fallback = '____________________________') {
  return value && value.trim() ? escapeHtml(value.trim()) : fallback;
}

function normalizeCityState(city?: string | null, state?: string | null) {
  if (city && state) return `${escapeHtml(city)}/${escapeHtml(state)}`;
  return escapeHtml(city || state || '');
}

function getLogoDataUri() {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo-leme.png');
    if (!fs.existsSync(logoPath)) return '';
    const base64 = fs.readFileSync(logoPath).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch {
    return '';
  }
}

function p(text: string) {
  return `<p>${text}</p>`;
}

function h(text: string) {
  return `<h2>${escapeHtml(text)}</h2>`;
}

function pb(prefix: string, text: string) {
  return `<p><strong>${escapeHtml(prefix)}</strong>${escapeHtml(text)}</p>`;
}

export function buildContractHtml(data: ContractData) {
  const logo = getLogoDataUri();
  const clientCityState = normalizeCityState(data.client.city, data.client.state);
  const companyCityState = normalizeCityState(data.company.city, data.company.state);
  const valueText = data.monthlyValueText?.trim() || valueToWordsBRL(data.monthlyValueCents);
  const signatureCompany = data.company.signatureLabel || data.company.companyName;
  const generatedAt = new Date().toLocaleString('pt-BR');

  const clauses = [
    p(
      `Pelo presente instrumento particular de prestação de serviços, de um lado, como CONTRATANTE, ${maybe(data.client.name)}, pessoa jurídica/física inscrita no CPF/CNPJ nº ${maybe(data.client.document)}, com sede/endereço em ${maybe(data.client.address)}${clientCityState ? `, ${clientCityState}` : ''}${data.client.representative ? `, neste ato representada por ${escapeHtml(data.client.representative)}` : ''}; e, de outro lado, como CONTRATADA, ${maybe(data.company.companyName)}, inscrita no CNPJ nº ${maybe(data.company.document)}, com sede em ${maybe(data.company.address)}${companyCityState ? `, ${companyCityState}` : ''}, têm entre si justo e contratado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL, que se regerá pelas cláusulas e condições seguintes, bem como pelos artigos 593 e seguintes do Código Civil Brasileiro.`
    ),
    h('CLÁUSULA PRIMEIRA - DO OBJETO'),
    p(`Constitui objeto do presente contrato a prestação, pela CONTRATADA, de serviços especializados de marketing digital em favor da CONTRATANTE, compreendendo ${escapeHtml(data.serviceDescription)}.`),
    pb('Parágrafo primeiro - ', 'O presente contrato possui natureza estritamente civil e empresarial, inexistindo qualquer vínculo empregatício entre as partes, responsabilizando-se a CONTRATADA exclusivamente pela forma de execução dos serviços ora ajustados.'),
    pb('Parágrafo segundo - ', 'A CONTRATADA compromete-se a empregar seus conhecimentos técnicos e estratégicos na execução dos serviços contratados, não podendo, contudo, garantir resultados específicos, uma vez que o desempenho das campanhas e ações de marketing depende de diversos fatores externos, incluindo condições de mercado, comportamento do público e funcionamento das plataformas digitais.'),

    h('CLÁUSULA SEGUNDA - DO PRAZO DE VIGÊNCIA'),
    p(`O presente contrato vigorará pelo prazo determinado de 06 (seis) meses, com início em ${formatShortDate(data.startDate)} e término em ${formatShortDate(data.endDate)}, sendo automaticamente renovado por prazo indeterminado caso não haja manifestação expressa em sentido contrário por qualquer das partes, mediante comunicação formal escrita com antecedência mínima de 30 (trinta) dias da data de encerramento da vigência.`),
    pb('Parágrafo único - ', 'A ausência de manifestação no prazo acima estipulado implicará renovação automática e integral do presente instrumento.'),

    h('CLÁUSULA TERCEIRA - DA REMUNERAÇÃO E FORMA DE PAGAMENTO'),
    p(`Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA o valor mensal de ${formatCurrencyFromCents(data.monthlyValueCents)} (${escapeHtml(valueText)}), com vencimento todo dia ${String(data.dueDay).padStart(2, '0')} de cada mês, mediante transferência bancária, PIX, boleto ou outro meio previamente ajustado entre as partes.`),
    pb('Parágrafo primeiro - ', 'O inadimplemento acarretará incidência de multa moratória de 2% (dois por cento) sobre o valor devido e juros de mora de 1% (um por cento) ao mês.'),
    pb('Parágrafo segundo - ', 'O atraso superior a 15 (quinze) dias autoriza a CONTRATADA, independentemente de aviso prévio, a suspender imediatamente a prestação dos serviços, campanhas, anúncios, acessos, publicações e manutenção de plataformas, sem prejuízo da cobrança judicial ou extrajudicial dos valores pendentes.'),
    pb('Parágrafo terceiro - ', 'Os valores referentes a impulsionamentos, anúncios patrocinados, hospedagem de sites, registro de domínio, contratação de plataformas, ferramentas, bancos de imagem, softwares, aplicativos e quaisquer investimentos destinados à execução das campanhas não estão incluídos na remuneração contratual, sendo de responsabilidade exclusiva da CONTRATANTE.'),

    h('CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATANTE'),
    p('Compete à CONTRATANTE fornecer, em tempo hábil, todas as informações, materiais, documentos, aprovações, acessos e conteúdos necessários para a adequada execução dos serviços contratados, responsabilizando-se integralmente pela veracidade das informações disponibilizadas.'),
    pb('Parágrafo primeiro - ', 'A ausência de envio de materiais, aprovações ou informações pela CONTRATANTE poderá comprometer cronogramas, campanhas e entregas, não gerando qualquer responsabilidade à CONTRATADA.'),
    pb('Parágrafo segundo - ', 'A CONTRATANTE obriga-se a efetuar os pagamentos nas datas ajustadas, bem como a manter ativos os acessos, assinaturas e plataformas necessárias à execução dos serviços.'),

    h('CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL'),
    p('Todo o planejamento estratégico, metodologia, estrutura operacional, funis, copys, roteiros, campanhas, materiais publicitários, layouts, artes, estratégias comerciais, anúncios e demais conteúdos intelectuais desenvolvidos pela CONTRATADA constituem propriedade intelectual exclusiva desta, nos termos da legislação aplicável.'),
    pb('Parágrafo primeiro - ', 'A utilização dos materiais produzidos fica condicionada à regular adimplência contratual.'),
    pb('Parágrafo segundo - ', 'Em caso de inadimplemento ou rescisão motivada pela CONTRATANTE, poderá a CONTRATADA suspender campanhas, restringir acessos, interromper publicações e retirar do ar websites, páginas ou materiais vinculados aos serviços prestados até a integral regularização das pendências financeiras.'),
    pb('Parágrafo terceiro - ', 'O website eventualmente desenvolvido permanecerá vinculado à CONTRATADA até a quitação integral de todas as obrigações contratuais.'),

    h('CLÁUSULA SEXTA - DA APROVAÇÃO DE MATERIAIS'),
    p('Os materiais, campanhas, conteúdos, artes, legendas, roteiros e demais entregas encaminhadas pela CONTRATADA para aprovação da CONTRATANTE serão considerados automaticamente aprovados caso não haja manifestação em sentido contrário no prazo de 48 (quarenta e oito) horas após o envio.'),

    h('CLÁUSULA SÉTIMA - DO USO INSTITUCIONAL E PORTFÓLIO'),
    p('A CONTRATANTE autoriza a CONTRATADA a utilizar sua marca, nome empresarial, materiais produzidos, campanhas e resultados obtidos para fins institucionais, comerciais e de divulgação de portfólio, inclusive em redes sociais, apresentações comerciais e website da CONTRATADA, salvo manifestação expressa em sentido contrário.'),

    h('CLÁUSULA OITAVA - DO CASO FORTUITO E FORÇA MAIOR'),
    p('Nenhuma das partes será responsabilizada pelo descumprimento de obrigações decorrentes de eventos de caso fortuito ou força maior, nos termos do artigo 393 do Código Civil, incluindo falhas sistêmicas, indisponibilidade de plataformas digitais, ataques cibernéticos, interrupções de internet ou eventos alheios à vontade das partes.'),

    h('CLÁUSULA NONA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS'),
    p('As partes obrigam-se a manter absoluto sigilo acerca de todas as informações técnicas, estratégicas, comerciais, financeiras, operacionais e dados pessoais compartilhados em razão deste contrato, comprometendo-se a não divulgá-los a terceiros sem autorização prévia e expressa.'),
    pb('Parágrafo único - ', 'As partes declaram ciência e concordância com as disposições da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD), comprometendo-se a adotar medidas razoáveis de segurança e proteção de dados eventualmente tratados no âmbito da relação contratual.'),

    h('CLÁUSULA DÉCIMA - DA RESCISÃO E MULTA CONTRATUAL'),
    p('O presente contrato poderá ser rescindido por comum acordo entre as partes, por descumprimento contratual ou mediante notificação formal com antecedência mínima de 30 (trinta) dias.'),
    pb('Parágrafo primeiro - ', 'Em caso de rescisão antecipada imotivada por iniciativa da CONTRATANTE antes do término do período contratual de 06 (seis) meses, ficará esta obrigada ao pagamento de multa compensatória equivalente a 50% (cinquenta por cento) do saldo remanescente do contrato até o término da vigência originalmente pactuada.'),
    pb('Parágrafo segundo - ', 'A rescisão não exime a CONTRATANTE do pagamento de valores já vencidos, serviços executados, campanhas ativas, despesas operacionais e investimentos realizados até a data do efetivo encerramento contratual.'),

    h('CLÁUSULA DÉCIMA PRIMEIRA - DA LIMITAÇÃO DE RESPONSABILIDADE'),
    p('A CONTRATADA não poderá ser responsabilizada por bloqueios de contas em redes sociais, alterações de algoritmos, quedas de plataformas, indisponibilidade de sistemas de terceiros, oscilações de mercado, perda de resultados comerciais ou quaisquer prejuízos decorrentes de informações incorretas, omissões ou atrasos imputáveis à CONTRATANTE.'),

    h('CLÁUSULA DÉCIMA SEGUNDA - DAS DISPOSIÇÕES GERAIS'),
    p('A eventual tolerância de qualquer das partes quanto ao descumprimento de cláusulas contratuais será interpretada como mera liberalidade, não constituindo novação, renúncia ou alteração tácita das disposições pactuadas.'),
    pb('Parágrafo primeiro - ', 'As comunicações realizadas por e-mail, aplicativos de mensagens, inclusive WhatsApp, ou outros meios eletrônicos utilizados entre as partes serão consideradas válidas para todos os fins de direito.'),
    pb('Parágrafo segundo - ', 'O presente instrumento obriga as partes, seus herdeiros e sucessores, sendo vedada sua cessão ou transferência sem autorização expressa da outra parte.'),

    h('CLÁUSULA DÉCIMA TERCEIRA - DO FORO'),
    p(`Fica eleito o foro da Comarca de ${maybe(data.company.defaultForoCity, 'Araguari/MG')} para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`),
    data.notes?.trim() ? `${h('OBSERVAÇÕES ADICIONAIS')}${p(escapeHtml(data.notes.trim()))}` : '',
    p('E, por estarem justas e contratadas, firmam o presente instrumento em 02 (duas) vias de igual teor e forma.'),
    `<p class="date-line">${escapeHtml(data.citySignature)}, ${formatLongDate(data.signatureDate)}.</p>`
  ].join('\n');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Contrato ${escapeHtml(data.number)} - ${escapeHtml(data.client.name)}</title>
  <style>
    @page { size: A4; margin: 22mm 16mm 18mm 16mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #111827; font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.45; }
    .header { margin: -22mm -16mm 14mm -16mm; height: 24mm; background: #183850; display: flex; align-items: center; justify-content: space-between; padding: 0 16mm; color: #fff; }
    .logo { max-width: 42mm; max-height: 14mm; display: block; }
    .logo-text { font-family: Arial, sans-serif; font-weight: 700; font-size: 18pt; letter-spacing: .06em; }
    .meta { font-family: Arial, sans-serif; font-size: 8pt; text-align: right; opacity: .9; line-height: 1.25; }
    h1 { font-size: 15pt; text-align: center; margin: 0 0 9mm; font-weight: 700; letter-spacing: .02em; }
    h2 { font-size: 11.2pt; margin: 6mm 0 2mm; break-after: avoid; page-break-after: avoid; font-weight: 700; }
    p { margin: 0 0 3.2mm; text-align: justify; }
    strong { font-weight: 700; }
    .date-line { margin-top: 8mm; text-align: left; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 18mm; margin-top: 20mm; break-inside: avoid; page-break-inside: avoid; }
    .signature { text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; }
    .signature .line { border-top: 1px solid #111827; padding-top: 3mm; margin-bottom: 1.5mm; }
    .responsavel { margin-top: 8mm; color: #4b5563; font-family: Arial, sans-serif; font-size: 8.5pt; }
    .footer-note { margin-top: 8mm; color: #6b7280; font-family: Arial, sans-serif; font-size: 8pt; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    ${logo ? `<img src="${logo}" class="logo" alt="LEME" />` : '<div class="logo-text">LEME</div>'}
    <div class="meta">Contrato gerado pela plataforma LEME Contratos<br />Nº ${escapeHtml(data.number)}<br />${escapeHtml(generatedAt)}</div>
  </div>

  <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL</h1>

  ${clauses}

  <div class="signatures">
    <div class="signature">
      <div class="line">CONTRATANTE</div>
      <strong>${escapeHtml(data.client.name)}</strong>
      ${data.client.document ? `<br />CPF/CNPJ Nº ${escapeHtml(data.client.document)}` : ''}
    </div>
    <div class="signature">
      <div class="line">${escapeHtml(signatureCompany).toUpperCase()}</div>
      <strong>${escapeHtml(data.company.companyName)}</strong>
      ${data.company.document ? `<br />CNPJ Nº ${escapeHtml(data.company.document)}` : ''}
    </div>
  </div>

  ${data.preset ? `<p class="responsavel">Responsável pelo preenchimento: ${escapeHtml(data.preset.fullName)}${data.preset.signatureTitle ? ` - ${escapeHtml(data.preset.signatureTitle)}` : ''}. Contrato nº ${escapeHtml(data.number)}.</p>` : ''}
  <p class="footer-note">Documento gerado automaticamente pela plataforma LEME Contratos.</p>
</body>
</html>`;
}
