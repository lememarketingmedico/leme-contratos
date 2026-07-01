'use client';

import { useMemo, useState } from 'react';

const sampleValues: Record<string, string> = {
  client_name: 'Dra. Cliente Exemplo',
  client_signature_name: 'Dra. Cliente Exemplo',
  client_document: '000.000.000-00',
  client_address: 'Rua Exemplo, nº 100, Centro, Araguari/MG',
  company_legal_name: '62.641.373 MATHEUS ISSAO RIBEIRO ADATI',
  company_trade_name: 'Leme Marketing Médico',
  company_document: '62.641.373/0001-07',
  company_address: 'Rua Zélia Maria Silva Braga, nº 43, Bairro Milenium, CEP 38.447-439, Araguari/MG',
  company_city_state: 'Araguari/MG',
  company_signature_label: 'LEME MARKETING MÉDICO',
  service_description: 'gerenciamento de redes sociais, criação, desenvolvimento e manutenção de website, captação de imagens e conteúdos audiovisuais, gestão de tráfego pago, planejamento estratégico, produção de conteúdos digitais e demais atividades correlatas necessárias à execução da estratégia comercial e publicitária da CONTRATANTE',
  start_date: '01/07/2026',
  end_date: '01/01/2027',
  monthly_value_number: '1.197,00',
  monthly_value_text: 'mil cento e noventa e sete reais',
  due_day: '10',
  foro_city: 'Araguari/MG',
  signature_city: 'Araguari/MG',
  signature_date_long: '01 de julho de 2026',
  preset_full_name: 'Matheus Issao Ribeiro Adati',
  preset_signature_title: 'Responsável comercial',
  contract_number: 'LEME-2026-0001',
  additional_notes_block: ''
};

const previewStyles = `
  <style>
    @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #f3f4f6; }
    body { font-family: Arial, sans-serif; }
    .paper {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: white;
      padding: 68px 57px;
      box-shadow: 0 0 0 1px #ddd;
    }
    .document { width: 100%; font-family: "Times New Roman", Times, serif; color: #111; font-size: 14px; line-height: 1.38; }
    h1 { margin: 0 0 28px; text-align: center; font-size: 20px; line-height: 1.25; font-weight: 700; }
    h2 { margin: 24px 0 10px; font-size: 15px; line-height: 1.25; font-weight: 700; }
    p { margin: 0 0 9px; text-align: justify; }
    .signature-date { margin-top: 26px; margin-bottom: 34px; text-align: left; }
    .signature-page, .signature-stack { padding-top: 22px !important; min-height: 0 !important; }
    .signature-grid { display: block !important; }
    .signature-box { width: 58%; margin-top: 34px; }
    .signature-line { border-top: 1px solid #111; margin-bottom: 9px; width: 100%; }
    .signature-title, .signature-name, .signature-doc, .signature-meta { text-align: left; }
    .signature-title { font-weight: 700; font-size: 16px; margin-bottom: 0; }
    .signature-name { font-weight: 700; margin-bottom: 3px; }
    .signature-doc { font-weight: 700; margin-bottom: 0; }
    .signature-meta { display: none !important; }
  </style>
`;

function renderTemplate(value: string) {
  let html = value;
  for (const [key, replacement] of Object.entries(sampleValues)) {
    html = html.split(`{{${key}}}`).join(replacement);
  }
  html = html.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, '');
  return `<!doctype html><html><head><meta charset="utf-8" />${previewStyles}</head><body><div class="paper">${html}</div></body></html>`;
}

type Props = {
  name: string;
  defaultValue: string;
  placeholders: string[];
};

export default function ContractTemplateEditor({ name, defaultValue, placeholders }: Props) {
  const [value, setValue] = useState(defaultValue);
  const srcDoc = useMemo(() => renderTemplate(value), [value]);

  return (
    <div className="template-editor-grid">
      <div className="field">
        <label>Modelo completo do contrato em HTML</label>
        <p style={{ margin: '6px 0 12px', color: 'var(--muted)' }}>
          Edite o texto aqui. A prévia ao lado usa dados fictícios só para você visualizar a estrutura antes de gerar o PDF real.
        </p>
        <textarea
          className="textarea"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{ minHeight: 780, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.45 }}
        />
        <div className="card" style={{ marginTop: 16, background: 'var(--surface-soft)' }}>
          <h2 style={{ marginTop: 0 }}>Variáveis disponíveis</h2>
          <p style={{ color: 'var(--muted)' }}>Clique duas vezes na variável para copiar manualmente, ou selecione e copie.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {placeholders.map((item) => (
              <span key={item} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="template-preview-panel">
        <div className="template-preview-header">
          <strong>Prévia do contrato</strong>
          <span>Aproximação visual do PDF</span>
        </div>
        <iframe title="Prévia do contrato" srcDoc={srcDoc} className="template-preview-frame" />
      </div>
    </div>
  );
}
