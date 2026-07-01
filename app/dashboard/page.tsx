import Link from 'next/link';
import { prisma } from '../../lib/db';
import { requireUser } from '../../lib/auth';
import { formatCurrencyFromCents, formatShortDate, statusLabels } from '../../lib/format';

export default async function DashboardPage() {
  await requireUser();

  const [contractsCount, clientsCount, presetsCount, latestContracts, signedCount] = await Promise.all([
    prisma.contract.count(),
    prisma.client.count(),
    prisma.preset.count(),
    prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: true, preset: true }
    }),
    prisma.contract.count({ where: { status: 'SIGNED' } })
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Painel</p>
          <h1>Contratos da LEME</h1>
          <p>Gere contratos preenchidos automaticamente e baixe o PDF em poucos cliques.</p>
        </div>
        <Link className="primary-button" href="/contratos/novo">Novo contrato</Link>
      </div>

      <section className="card-grid">
        <div className="stat-card"><span>Contratos</span><strong>{contractsCount}</strong></div>
        <div className="stat-card"><span>Clientes</span><strong>{clientsCount}</strong></div>
        <div className="stat-card"><span>Assinados</span><strong>{signedCount}</strong></div>
      </section>

      <div style={{ height: 18 }} />

      <section className="card">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div>
            <p className="eyebrow">Recentes</p>
            <h2>Últimos contratos</h2>
          </div>
          <span className="badge">{presetsCount} predefinições</span>
        </div>

        <div className="table-wrap" style={{ boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {latestContracts.length === 0 ? (
                <tr><td colSpan={6}>Nenhum contrato criado ainda.</td></tr>
              ) : latestContracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.number}</td>
                  <td>{contract.client.name}</td>
                  <td>{formatCurrencyFromCents(contract.monthlyValueCents)}</td>
                  <td><span className="badge">{statusLabels[contract.status]}</span></td>
                  <td>{formatShortDate(contract.createdAt)}</td>
                  <td><Link className="secondary-button" href={`/contratos/${contract.id}`}>Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
