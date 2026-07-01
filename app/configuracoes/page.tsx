import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { saveCompanyConfigAction } from '@/app/actions';

export default async function ConfigPage({ searchParams }: { searchParams?: { salvo?: string } }) {
  await requireUser();

  const config = await prisma.companyConfig.findFirst();

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">LEME</p>
          <h1>Configurações da empresa</h1>
          <p>Esses dados aparecem automaticamente nos contratos da LEME.</p>
        </div>
      </div>

      {searchParams?.salvo ? <div className="alert success">Configurações salvas com sucesso.</div> : null}
      <div style={{ height: 16 }} />

      <form className="card form-section" action={saveCompanyConfigAction}>
        <input type="hidden" name="id" value={config?.id || ''} />
        <div className="form-grid">
          <div className="field"><label>Nome da empresa</label><input className="input" name="companyName" defaultValue={config?.companyName || 'LEME MARKETING MÉDICO'} required /></div>
          <div className="field"><label>CNPJ</label><input className="input" name="document" defaultValue={config?.document || ''} /></div>
          <div className="field"><label>E-mail</label><input className="input" name="email" type="email" defaultValue={config?.email || ''} /></div>
          <div className="field"><label>Telefone</label><input className="input" name="phone" defaultValue={config?.phone || ''} /></div>
          <div className="field"><label>Cidade</label><input className="input" name="city" defaultValue={config?.city || ''} /></div>
          <div className="field"><label>Estado</label><input className="input" name="state" maxLength={2} defaultValue={config?.state || ''} /></div>
          <div className="field"><label>Foro padrão</label><input className="input" name="defaultForoCity" defaultValue={config?.defaultForoCity || 'Araguari/MG'} /></div>
          <div className="field"><label>Nome na assinatura</label><input className="input" name="signatureLabel" defaultValue={config?.signatureLabel || 'LEME MARKETING MÉDICO'} /></div>
        </div>

        <div className="field"><label>Endereço da empresa</label><textarea className="textarea" name="address" defaultValue={config?.address || ''} /></div>

        <div className="form-grid">
          <div className="field"><label>PIX</label><input className="input" name="pix" defaultValue={config?.pix || ''} /></div>
          <div className="field"><label>Dados bancários</label><input className="input" name="bankInfo" defaultValue={config?.bankInfo || ''} /></div>
        </div>

        <button className="primary-button" type="submit">Salvar configurações</button>
      </form>
    </>
  );
}
