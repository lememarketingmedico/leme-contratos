import { prisma } from '../../lib/db';
import { requireUser } from '../../lib/auth';
import { saveCompanyConfigAction } from '../actions';
import { DEFAULT_CONTRACT_TEMPLATE_HTML } from '../../lib/contractHtml';
import ContractTemplateEditor from '../../components/ContractTemplateEditor';

const placeholders = [
  '{{client_name}}',
  '{{client_document}}',
  '{{client_address}}',
  '{{company_legal_name}}',
  '{{company_trade_name}}',
  '{{company_document}}',
  '{{company_address}}',
  '{{service_description}}',
  '{{start_date}}',
  '{{end_date}}',
  '{{monthly_value_number}}',
  '{{monthly_value_text}}',
  '{{due_day}}',
  '{{foro_city}}',
  '{{signature_city}}',
  '{{signature_date_long}}',
  '{{client_signature_name}}',
  '{{company_signature_label}}',
  '{{preset_full_name}}',
  '{{preset_signature_title}}',
  '{{contract_number}}',
  '{{additional_notes_block}}'
];

export default async function ConfigPage({ searchParams }: { searchParams?: { salvo?: string } }) {
  await requireUser();

  const config = await prisma.companyConfig.findFirst();

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">LEME</p>
          <h1>Configurações da empresa</h1>
          <p>Esses dados aparecem automaticamente nos contratos da LEME. Agora você também pode alterar o modelo completo do contrato.</p>
        </div>
      </div>

      {searchParams?.salvo ? <div className="alert success">Configurações salvas com sucesso.</div> : null}
      <div style={{ height: 16 }} />

      <form className="card form-section" action={saveCompanyConfigAction}>
        <input type="hidden" name="id" value={config?.id || ''} />
        <div className="form-grid">
          <div className="field"><label>Razão social</label><input className="input" name="companyName" defaultValue={config?.companyName || '62.641.373 MATHEUS ISSAO RIBEIRO ADATI'} required /></div>
          <div className="field"><label>Nome fantasia</label><input className="input" name="tradeName" defaultValue={config?.tradeName || 'Leme Marketing Médico'} /></div>
          <div className="field"><label>CNPJ</label><input className="input" name="document" defaultValue={config?.document || '62.641.373/0001-07'} /></div>
          <div className="field"><label>E-mail</label><input className="input" name="email" type="email" defaultValue={config?.email || ''} /></div>
          <div className="field"><label>Telefone</label><input className="input" name="phone" defaultValue={config?.phone || ''} /></div>
          <div className="field"><label>Cidade</label><input className="input" name="city" defaultValue={config?.city || 'Araguari'} /></div>
          <div className="field"><label>Estado</label><input className="input" name="state" maxLength={2} defaultValue={config?.state || 'MG'} /></div>
          <div className="field"><label>Foro padrão</label><input className="input" name="defaultForoCity" defaultValue={config?.defaultForoCity || 'Araguari/MG'} /></div>
          <div className="field"><label>Nome na assinatura</label><input className="input" name="signatureLabel" defaultValue={config?.signatureLabel || 'LEME MARKETING MÉDICO'} /></div>
        </div>

        <div className="field"><label>Endereço da empresa</label><textarea className="textarea" name="address" defaultValue={config?.address || 'Rua Zélia Maria Silva Braga, nº 43, Bairro Milenium, CEP 38.447-439'} /></div>

        <div className="form-grid">
          <div className="field"><label>PIX</label><input className="input" name="pix" defaultValue={config?.pix || ''} /></div>
          <div className="field"><label>Dados bancários</label><input className="input" name="bankInfo" defaultValue={config?.bankInfo || ''} /></div>
        </div>

        <div style={{ marginTop: 18 }}>
          <ContractTemplateEditor
            name="contractTemplateHtml"
            defaultValue={config?.contractTemplateHtml || DEFAULT_CONTRACT_TEMPLATE_HTML}
            placeholders={placeholders}
          />
        </div>

        <div style={{ height: 16 }} />
        <button className="primary-button" type="submit">Salvar configurações</button>
      </form>
    </>
  );
}
