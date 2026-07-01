# Configuração exata no EasyPanel para o sistema LEME Contratos

Pelo print enviado, o banco está assim:

- Serviço do banco: `sistema-leme / contratos-postgres`
- Usuário: `leme_contratos_user`
- Nome do banco: `leme_contratos`
- Host interno: `sistema-leme_contratos-postgres`
- Porta interna: `5432`
- Senha real: `LemeContratos_DB_2026@Seguro_47xP`

## Variáveis corretas para colar no serviço do app

Cole no serviço do sistema, exemplo `contratos-web`:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratos_DB_2026%40Seguro_47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratos_AppSecret_2026@LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratos_Admin_2026@PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

## Por que precisa do %40?

A senha real tem `@`:

```txt
LemeContratos_DB_2026@Seguro_47xP
```

Dentro de uma URL, o `@` separa senha e host. Por isso, dentro da `DATABASE_URL`, ele precisa virar `%40`:

```txt
LemeContratos_DB_2026%40Seguro_47xP
```

## Se ainda ficar amarelo

1. Abra os logs do serviço do app.
2. Se aparecer `Can't reach database server`, o host interno está errado ou o banco ainda não iniciou.
3. Se aparecer `Authentication failed`, a senha do banco não é a mesma usada na URL.
4. Se aparecer `Database does not exist`, o banco `leme_contratos` não foi criado.
5. Depois de qualquer mudança nas variáveis, clique em redeploy no app.
