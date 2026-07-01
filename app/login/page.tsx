import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth';

export default async function LoginPage({ searchParams }: { searchParams?: { erro?: string } }) {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="login-page">
      <form className="login-card" action="/api/auth/login" method="post">
        <div className="login-logo">
          <Image src="/logo-leme.png" alt="LEME" width={320} height={42} priority />
        </div>

        <div>
          <p className="eyebrow">LEME Contratos</p>
          <h1>Acesse sua plataforma</h1>
          <p>Entre para gerar contratos preenchidos automaticamente em PDF.</p>
        </div>

        {searchParams?.erro ? <div className="alert error">E-mail ou senha incorretos.</div> : null}

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input className="input" id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        <button className="primary-button" type="submit">Entrar</button>
      </form>
    </div>
  );
}
