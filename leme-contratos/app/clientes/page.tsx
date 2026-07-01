import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { formatShortDate } from '@/lib/format';

export default async function ClientsPage() {
  await requireUser();

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { contracts: true } } }
  });

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Base</p>
          <h1>Clientes</h1>
          <p>Clientes são salvos automaticamente quando você gera um contrato.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Cidade</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Contratos</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={7}>Nenhum cliente salvo ainda.</td></tr>
            ) : clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.document || 'Não informado'}</td>
                <td>{client.city ? `${client.city}${client.state ? `/${client.state}` : ''}` : 'Não informado'}</td>
                <td>{client.email || 'Não informado'}</td>
                <td>{client.phone || 'Não informado'}</td>
                <td>{client._count.contracts}</td>
                <td>{formatShortDate(client.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
