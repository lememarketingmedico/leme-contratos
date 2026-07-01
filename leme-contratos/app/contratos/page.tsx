import Link from 'next/link';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { formatCurrencyFromCents, formatShortDate, statusLabels } from '@/lib/format';

export default async function ContractsPage() {
  await requireUser();

  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true, preset: true }
  });

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Histórico</p>
          <h1>Contratos gerados</h1>
          <p>Consulte, baixe em PDF e acompanhe o status dos contratos.</p>
        </div>
        <Link className="primary-button" href="/contratos/novo">Novo contrato</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Responsável</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr><td colSpan={7}>Nenhum contrato criado ainda.</td></tr>
            ) : contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.number}</td>
                <td>{contract.client.name}</td>
                <td>{contract.preset?.name || 'Sem predefinição'}</td>
                <td>{formatCurrencyFromCents(contract.monthlyValueCents)}</td>
                <td><span className="badge">{statusLabels[contract.status]}</span></td>
                <td>{formatShortDate(contract.createdAt)}</td>
                <td>
                  <div className="actions-row">
                    <Link className="secondary-button" href={`/contratos/${contract.id}`}>Abrir</Link>
                    <a className="primary-button" href={`/api/contracts/${contract.id}/pdf`}>PDF</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
