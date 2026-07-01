import { formatCurrencyFromCents, formatLongDate, formatShortDate, valueToWordsBRL } from './format';

type Company = {
  companyName: string;
  tradeName?: string | null;
  document?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  email?: string | null;
  phone?: string | null;
  defaultForoCity?: string | null;
  signatureLabel?: string | null;
  contractTemplateHtml?: string | null;
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

function maybeText(value?: string | null, fallback = '____________________________') {
  return value && value.trim() ? escapeHtml(value.trim()) : fallback;
}

function normalizeCityState(city?: string | null, state?: string | null) {
  if (city && state) return `${escapeHtml(city)}/${escapeHtml(state)}`;
  return escapeHtml(city || state || '');
}

function renderTemplate(template: string, replacements: Record<string, string>) {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(`{{${key}}}`).join(value);
  }
  return html.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, '');
}

function buildNotesSection(notes?: string | null) {
  if (!notes?.trim()) return '';

  return `
    <section class="keep-together notes-block">
      <h2>OBSERVAÇÕES ADICIONAIS</h2>
      <p>${escapeHtml(notes).replace(/\n/g, '<br />')}</p>
    </section>
  `;
}

function getDefaultTemplate() {
  return `
    <div class="document">
      <section class="keep-together title-block">
        <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL</h1>
      </section>

      <section class="contract-section">
        <p>Pelo presente instrumento particular de prestação de serviços, de um lado, como <strong>CONTRATANTE</strong>, {{client_name}}, pessoa jurídica/física inscrita no CPF/CNPJ nº {{client_document}}, com sede/endereço em {{client_address}}, neste ato representada na forma de seus atos constitutivos, e, de outro lado, como <strong>CONTRATADA</strong>, {{company_legal_name}}, nome fantasia {{company_trade_name}}, inscrita no CNPJ sob o nº {{company_document}}, com sede na {{company_address}}, têm entre si justo e contratado o presente <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL</strong>, que se regerá pelas cláusulas e condições seguintes, bem como pelos artigos 593 e seguintes do Código Civil Brasileiro.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA PRIMEIRA - DO OBJETO</h2>
        <p>Constitui objeto do presente contrato a prestação, pela CONTRATADA, de serviços especializados de marketing digital em favor da CONTRATANTE, compreendendo {{service_description}}.</p>
        <p><strong>Parágrafo primeiro - </strong>O presente contrato possui natureza estritamente civil e empresarial, inexistindo qualquer vínculo empregatício entre as partes, responsabilizando-se a CONTRATADA exclusivamente pela forma de execução dos serviços ora ajustados.</p>
        <p><strong>Parágrafo segundo - </strong>A CONTRATADA compromete-se a empregar seus conhecimentos técnicos e estratégicos na execução dos serviços contratados, não podendo, contudo, garantir resultados específicos, uma vez que o desempenho das campanhas e ações de marketing depende de diversos fatores externos, incluindo condições de mercado, comportamento do público e funcionamento das plataformas digitais.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA SEGUNDA - DO PRAZO DE VIGÊNCIA</h2>
        <p>O presente contrato vigorará pelo prazo determinado de 06 (seis) meses, com início em {{start_date}} e término em {{end_date}}, sendo automaticamente renovado por prazo indeterminado caso não haja manifestação expressa em sentido contrário por qualquer das partes, mediante comunicação formal escrita com antecedência mínima de 30 (trinta) dias da data de encerramento da vigência.</p>
        <p><strong>Parágrafo único - </strong>A ausência de manifestação no prazo acima estipulado implicará renovação automática e integral do presente instrumento.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA TERCEIRA - DA REMUNERAÇÃO E FORMA DE PAGAMENTO</h2>
        <p>Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ {{monthly_value_number}} ({{monthly_value_text}}), com vencimento todo dia {{due_day}} de cada mês, mediante transferência bancária, PIX, boleto ou outro meio previamente ajustado entre as partes.</p>
        <p><strong>Parágrafo primeiro - </strong>O inadimplemento acarretará incidência de multa moratória de 2% (dois por cento) sobre o valor devido e juros de mora de 1% (um por cento) ao mês.</p>
        <p><strong>Parágrafo segundo - </strong>O atraso superior a 15 (quinze) dias autoriza a CONTRATADA, independentemente de aviso prévio, a suspender imediatamente a prestação dos serviços, campanhas, anúncios, acessos, publicações e manutenção de plataformas, sem prejuízo da cobrança judicial ou extrajudicial dos valores pendentes.</p>
        <p><strong>Parágrafo terceiro - </strong>Os valores referentes a impulsionamentos, anúncios patrocinados, hospedagem de sites, registro de domínio, contratação de plataformas, ferramentas, bancos de imagem, softwares, aplicativos e quaisquer investimentos destinados à execução das campanhas não estão incluídos na remuneração contratual, sendo de responsabilidade exclusiva da CONTRATANTE.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATANTE</h2>
        <p>Compete à CONTRATANTE fornecer, em tempo hábil, todas as informações, materiais, documentos, aprovações, acessos e conteúdos necessários para a adequada execução dos serviços contratados, responsabilizando-se integralmente pela veracidade das informações disponibilizadas.</p>
        <p><strong>Parágrafo primeiro - </strong>A ausência de envio de materiais, aprovações ou informações pela CONTRATANTE poderá comprometer cronogramas, campanhas e entregas, não gerando qualquer responsabilidade à CONTRATADA.</p>
        <p><strong>Parágrafo segundo - </strong>A CONTRATANTE obriga-se a efetuar os pagamentos nas datas ajustadas, bem como a manter ativos os acessos, assinaturas e plataformas necessárias à execução dos serviços.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA QUINTA - DA PROPRIEDADE INTELECTUAL</h2>
        <p>Todo o planejamento estratégico, metodologia, estrutura operacional, funis, copys, roteiros, campanhas, materiais publicitários, layouts, artes, estratégias comerciais, anúncios e demais conteúdos intelectuais desenvolvidos pela CONTRATADA constituem propriedade intelectual exclusiva desta, nos termos da legislação aplicável.</p>
        <p><strong>Parágrafo primeiro - </strong>A utilização dos materiais produzidos fica condicionada à regular adimplência contratual.</p>
        <p><strong>Parágrafo segundo - </strong>Em caso de inadimplemento ou rescisão motivada pela CONTRATANTE, poderá a CONTRATADA suspender campanhas, restringir acessos, interromper publicações e retirar do ar websites, páginas ou materiais vinculados aos serviços prestados até a integral regularização das pendências financeiras.</p>
        <p><strong>Parágrafo terceiro - </strong>O website eventualmente desenvolvido permanecerá vinculado à CONTRATADA até a quitação integral de todas as obrigações contratuais.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA SEXTA - DA APROVAÇÃO DE MATERIAIS</h2>
        <p>Os materiais, campanhas, conteúdos, artes, legendas, roteiros e demais entregas encaminhadas pela CONTRATADA para aprovação da CONTRATANTE serão considerados automaticamente aprovados caso não haja manifestação em sentido contrário no prazo de 48 (quarenta e oito) horas após o envio.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA SÉTIMA - DO USO INSTITUCIONAL E PORTFÓLIO</h2>
        <p>A CONTRATANTE autoriza a CONTRATADA a utilizar sua marca, nome empresarial, materiais produzidos, campanhas e resultados obtidos para fins institucionais, comerciais e de divulgação de portfólio, inclusive em redes sociais, apresentações comerciais e website da CONTRATADA, salvo manifestação expressa em sentido contrário.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA OITAVA - DO CASO FORTUITO E FORÇA MAIOR</h2>
        <p>Nenhuma das partes será responsabilizada pelo descumprimento de obrigações decorrentes de eventos de caso fortuito ou força maior, nos termos do artigo 393 do Código Civil, incluindo falhas sistêmicas, indisponibilidade de plataformas digitais, ataques cibernéticos, interrupções de internet ou eventos alheios à vontade das partes.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA NONA - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS</h2>
        <p>As partes obrigam-se a manter absoluto sigilo acerca de todas as informações técnicas, estratégicas, comerciais, financeiras, operacionais e dados pessoais compartilhados em razão deste contrato, comprometendo-se a não divulgá-los a terceiros sem autorização prévia e expressa.</p>
        <p><strong>Parágrafo único - </strong>As partes declaram ciência e concordância com as disposições da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD), comprometendo-se a adotar medidas razoáveis de segurança e proteção de dados eventualmente tratados no âmbito da relação contratual.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA DÉCIMA - DA RESCISÃO E MULTA CONTRATUAL</h2>
        <p>O presente contrato poderá ser rescindido por comum acordo entre as partes, por descumprimento contratual ou mediante notificação formal com antecedência mínima de 30 (trinta) dias.</p>
        <p><strong>Parágrafo primeiro - </strong>Em caso de rescisão antecipada imotivada por iniciativa da CONTRATANTE antes do término do período contratual de 06 (seis) meses, ficará esta obrigada ao pagamento de multa compensatória equivalente a 50% (cinquenta por cento) do saldo remanescente do contrato até o término da vigência originalmente pactuada.</p>
        <p><strong>Parágrafo segundo - </strong>A rescisão não exime a CONTRATANTE do pagamento de valores já vencidos, serviços executados, campanhas ativas, despesas operacionais e investimentos realizados até a data do efetivo encerramento contratual.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA DÉCIMA PRIMEIRA - DA LIMITAÇÃO DE RESPONSABILIDADE</h2>
        <p>A CONTRATADA não poderá ser responsabilizada por bloqueios de contas em redes sociais, alterações de algoritmos, quedas de plataformas, indisponibilidade de sistemas de terceiros, oscilações de mercado, perda de resultados comerciais ou quaisquer prejuízos decorrentes de informações incorretas, omissões ou atrasos imputáveis à CONTRATANTE.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA DÉCIMA SEGUNDA - DAS DISPOSIÇÕES GERAIS</h2>
        <p>A eventual tolerância de qualquer das partes quanto ao descumprimento de cláusulas contratuais será interpretada como mera liberalidade, não constituindo novação, renúncia ou alteração tácita das disposições pactuadas.</p>
        <p><strong>Parágrafo primeiro - </strong>As comunicações realizadas por e-mail, aplicativos de mensagens, inclusive WhatsApp, ou outros meios eletrônicos utilizados entre as partes serão consideradas válidas para todos os fins de direito.</p>
        <p><strong>Parágrafo segundo - </strong>O presente instrumento obriga as partes, seus herdeiros e sucessores, sendo vedada sua cessão ou transferência sem autorização expressa da outra parte.</p>
      </section>

      <section class="contract-section keep-together">
        <h2>CLÁUSULA DÉCIMA TERCEIRA - DO FORO</h2>
        <p>Fica eleito o foro da Comarca de {{foro_city}} para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
      </section>

      {{additional_notes_block}}

      <section class="keep-together closing-block">
        <p>E, por estarem justas e contratadas, firmam o presente instrumento em 02 (duas) vias de igual teor e forma.</p>
        <p class="signature-date">{{signature_city}}, {{signature_date_long}}.</p>
      </section>

      <section class="signature-stack">
        <div class="signature-box">
          <div class="signature-line"></div>
          <p class="signature-title">CONTRATANTE</p>
        </div>

        <div class="signature-box">
          <div class="signature-line"></div>
          <p class="signature-title">{{company_signature_label}}</p>
          <p class="signature-doc">CNPJ nº {{company_document}}</p>
        </div>
      </section>
    </div>
  `;
}

function buildStyles() {
  return `
    <style>
      @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        font-family: "Times New Roman", Times, serif;
        color: #111;
        font-size: 14px;
        line-height: 1.38;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .document { width: 100%; }
      h1 {
        margin: 0 0 28px;
        text-align: center;
        font-size: 20px;
        line-height: 1.25;
        font-weight: 700;
      }
      h2 {
        margin: 24px 0 10px;
        font-size: 15px;
        line-height: 1.25;
        font-weight: 700;
        page-break-after: avoid;
        break-after: avoid;
      }
      p {
        margin: 0 0 9px;
        text-align: justify;
        orphans: 3;
        widows: 3;
      }

      /* Evita páginas quase vazias: as cláusulas podem quebrar normalmente.
         Só títulos e assinatura ficam protegidos contra quebras feias. */
      .title-block,
      .notes-block,
      .closing-block,
      .signature-stack,
      .signature-box {
        page-break-inside: avoid;
        break-inside: avoid-page;
      }

      .contract-section {
        page-break-inside: auto;
        break-inside: auto;
      }

      .notes-block p { white-space: normal; }
      .signature-date {
        margin-top: 26px;
        margin-bottom: 34px;
        text-align: left;
      }

      /* Compatibilidade com contratos salvos na versão anterior.
         Mesmo que o HTML salvo ainda tenha signature-page/signature-grid,
         a assinatura não será mais forçada para uma página nova. */
      .signature-page,
      .signature-stack {
        page-break-before: auto !important;
        break-before: auto !important;
        page-break-inside: avoid;
        break-inside: avoid-page;
        padding-top: 22px !important;
        min-height: 0 !important;
      }

      .signature-grid {
        display: block !important;
      }

      .signature-box {
        width: 58%;
        margin-top: 34px;
      }

      .signature-line {
        border-top: 1px solid #111;
        margin-bottom: 9px;
        width: 100%;
      }

      .signature-title,
      .signature-name,
      .signature-doc,
      .signature-meta {
        text-align: left;
      }

      .signature-title {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 0;
      }

      .signature-name {
        font-weight: 700;
        margin-bottom: 3px;
      }

      .signature-doc {
        font-weight: 700;
        margin-bottom: 0;
      }

      .signature-meta {
        display: none !important;
      }
    </style>
  `;
}

export function buildContractHtml(data: ContractData) {
  const companyCityState = normalizeCityState(data.company.city, data.company.state);
  const companyAddressFull = [
    data.company.address?.trim(),
    companyCityState || undefined
  ]
    .filter(Boolean)
    .join(', ');

  const clientAddressFull = [
    data.client.address?.trim(),
    normalizeCityState(data.client.city, data.client.state) || undefined
  ]
    .filter(Boolean)
    .join(', ');

  const template = data.company.contractTemplateHtml?.trim() || getDefaultTemplate();
  const monthlyValueText = data.monthlyValueText?.trim() || valueToWordsBRL(data.monthlyValueCents);

  const replacements = {
    client_name: maybeText(data.client.name),
    client_signature_name: maybeText(data.client.name),
    client_document: maybeText(data.client.document),
    client_address: maybeText(clientAddressFull),
    company_legal_name: maybeText(data.company.companyName),
    company_trade_name: maybeText(data.company.tradeName || data.company.signatureLabel || data.company.companyName),
    company_document: maybeText(data.company.document),
    company_address: maybeText(companyAddressFull),
    company_city_state: maybeText(companyCityState),
    company_signature_label: maybeText(data.company.signatureLabel || data.company.tradeName || data.company.companyName),
    service_description: escapeHtml(data.serviceDescription),
    start_date: formatShortDate(data.startDate),
    end_date: formatShortDate(data.endDate),
    monthly_value_number: formatCurrencyFromCents(data.monthlyValueCents).replace('R$ ', ''),
    monthly_value_text: escapeHtml(monthlyValueText),
    due_day: String(data.dueDay),
    foro_city: maybeText(data.company.defaultForoCity || 'Araguari/MG'),
    signature_city: escapeHtml(data.citySignature),
    signature_date_long: formatLongDate(data.signatureDate),
    additional_notes_block: buildNotesSection(data.notes),
    preset_full_name: maybeText(data.preset?.fullName || data.preset?.name || 'LEME'),
    preset_signature_title: maybeText(data.preset?.signatureTitle || 'Responsável comercial'),
    contract_number: escapeHtml(data.number)
  };

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(data.number)} - ${escapeHtml(data.client.name)}</title>
      ${buildStyles()}
    </head>
    <body>
      ${renderTemplate(template, replacements)}
    </body>
  </html>`;
}

export const DEFAULT_CONTRACT_TEMPLATE_HTML = getDefaultTemplate();
