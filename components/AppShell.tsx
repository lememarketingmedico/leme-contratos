import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) return <>{children}</>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <Image src="/logo-leme.png" alt="LEME" width={210} height={28} priority />
          <span>Contratos</span>
        </div>

        <nav className="nav-list">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/contratos/novo">Novo contrato</Link>
          <Link href="/contratos">Contratos</Link>
          <Link href="/clientes">Clientes</Link>
          <Link href="/predefinicoes">Predefinições</Link>
          <Link href="/configuracoes">Configurações</Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <ThemeToggle />
          <form action="/api/auth/logout" method="post">
            <button className="ghost-button full" type="submit">Sair</button>
          </form>
        </div>
      </aside>
      <main className="content-area">{children}</main>
    </div>
  );
}
