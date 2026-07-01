import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/db';
import { requireUser } from '../../../lib/auth';
import { updateContractStatusAction } from '../../actions';
import { formatCurrencyFromCents, formatShortDate, statusLabels } from '../../../lib/format';

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  await requireUser();

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: { client: true, preset: true }
  });

  if (!contract) notFound();

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Contrato {contract.number}</p>
          <h1>{contract.client.name}</h1>
          <p>Baixe o PDF, assine e atualize o status depois do envio ao cliente.</p>
        </div>
        <div className="actions-row">
          <a className="primary-button" href={`/api/contracts/${contract.id}/pdf`}>Baixar PDF</a>
          <Link className="secondary-button" href="/contratos">Voltar</Link>
        </div>
      </div>

      <div className="detail-grid">
        <section className="card">
          <h2>Resumo do contrato</h2>
          <div className="info-list" style={{ marginTop: 14 }}>
            <div className="info-item"><span>Status</span><strong>{statusLabels[contract.status]}</strong></div>
            <div className="info-item"><span>Valor mensal</span><strong>{formatCurrencyFromCents(contract.monthlyValueCents)}</strong></div>
            <div className="info-item"><span>Vencimento</span><strong>Todo dia {contract.dueDay}</strong></div>
            <div className="info-item"><span>Vigência</span><strong>{formatShortDate(contract.startDate)} até {formatShortDate(contract.endDate)}</strong></div>
            <div className="info-item"><span>Responsável</span><strong>{contract.preset?.name || 'Sem predefinição'}</strong></div>
            <div className="info-item"><span>Criado em</span><strong>{formatShortDate(contract.createdAt)}</strong></div>
          </div>
        </section>

        <aside className="card">
          <h2>Atualizar status</h2>
          <p>Use isso para controlar se o contrato já foi enviado ou assinado.</p>
          <form action={updateContractStatusAction} className="form-section">
            <input type="hidden" name="id" value={contract.id} />
            <div className="field">
              <label htmlFor="status">Status</label>
              <select className="select" name="status" id="status" defaultValue={contract.status}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <button className="primary-button" type="submit">Salvar status</button>
          </form>
        </aside>
      </div>

      <div style={{ height: 16 }} />

      <section className="card">
        <h2>Dados do cliente</h2>
        <div className="info-list" style={{ marginTop: 14 }}>
          <div className="info-item"><span>Nome</span><strong>{contract.client.name}</strong></div>
          <div className="info-item"><span>CPF/CNPJ</span><strong>{contract.client.document || 'Não informado'}</strong></div>
          <div className="info-item"><span>Representante</span><strong>{contract.client.representative || 'Não informado'}</strong></div>
          <div className="info-item"><span>Endereço</span><strong>{contract.client.address || 'Não informado'}</strong></div>
          <div className="info-item"><span>E-mail</span><strong>{contract.client.email || 'Não informado'}</strong></div>
          <div className="info-item"><span>Telefone</span><strong>{contract.client.phone || 'Não informado'}</strong></div>
        </div>
      </section>
    </>
  );
}
