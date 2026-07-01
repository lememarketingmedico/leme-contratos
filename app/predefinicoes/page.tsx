import { prisma } from '../../lib/db';
import { requireUser } from '../../lib/auth';
import { savePresetAction } from '../actions';

function PresetForm({ preset }: { preset?: any }) {
  return (
    <form className="card form-section" action={savePresetAction}>
      <input type="hidden" name="id" value={preset?.id || ''} />
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <p className="eyebrow">{preset ? 'Editar' : 'Nova'}</p>
          <h2>{preset?.name || 'Nova predefinição'}</h2>
        </div>
        <label className="checkbox-row">
          <input type="checkbox" name="active" defaultChecked={preset?.active ?? true} />
          <span>Ativa</span>
        </label>
      </div>

      <div className="form-grid">
        <div className="field"><label>Nome da predefinição</label><input className="input" name="name" defaultValue={preset?.name || ''} required /></div>
        <div className="field"><label>Nome completo</label><input className="input" name="fullName" defaultValue={preset?.fullName || ''} required /></div>
        <div className="field"><label>CPF/CNPJ</label><input className="input" name="document" defaultValue={preset?.document || ''} /></div>
        <div className="field"><label>E-mail</label><input className="input" name="email" type="email" defaultValue={preset?.email || ''} /></div>
        <div className="field"><label>Telefone</label><input className="input" name="phone" defaultValue={preset?.phone || ''} /></div>
        <div className="field"><label>Cargo/descrição</label><input className="input" name="signatureTitle" defaultValue={preset?.signatureTitle || ''} /></div>
        <div className="field"><label>Cidade</label><input className="input" name="city" defaultValue={preset?.city || ''} /></div>
        <div className="field"><label>Estado</label><input className="input" name="state" defaultValue={preset?.state || ''} maxLength={2} /></div>
      </div>

      <div className="field"><label>Endereço</label><textarea className="textarea" name="address" defaultValue={preset?.address || ''} /></div>
      <div className="form-grid">
        <div className="field"><label>PIX</label><input className="input" name="pix" defaultValue={preset?.pix || ''} /></div>
        <div className="field"><label>Dados bancários</label><input className="input" name="bankInfo" defaultValue={preset?.bankInfo || ''} /></div>
      </div>
      <button className="primary-button" type="submit">Salvar predefinição</button>
    </form>
  );
}

export default async function PresetsPage({ searchParams }: { searchParams?: { salvo?: string } }) {
  await requireUser();

  const presets = await prisma.preset.findMany({ orderBy: { name: 'asc' } });

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Automação</p>
          <h1>Predefinições</h1>
          <p>Cadastre Luis, Matheus ou outros responsáveis. Ao escolher uma predefinição, ela fica vinculada ao contrato.</p>
        </div>
      </div>

      {searchParams?.salvo ? <div className="alert success">Predefinição salva com sucesso.</div> : null}
      <div style={{ height: 16 }} />

      <div style={{ display: 'grid', gap: 16 }}>
        {presets.map((preset) => <PresetForm key={preset.id} preset={preset} />)}
        <PresetForm />
      </div>
    </>
  );
}
