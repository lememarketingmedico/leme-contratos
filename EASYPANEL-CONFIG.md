# Configuração no EasyPanel: LEME Contratos

Use estes nomes dentro do projeto existente `sistema-leme`.

## Serviços

- App: `contratos-web`
- Banco: `contratos-postgres`

No seu print, o EasyPanel mostrou o host interno do banco como:

```txt
sistema-leme_contratos-postgres
```

Então a `DATABASE_URL` do app deve usar esse host.

## Variáveis do contratos-web

Cole no serviço do APP, não no banco:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratos_DB_2026%40Seguro_47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratos_AppSecret_2026@LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratos_Admin_2026@PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
PORT=3000
HOSTNAME=0.0.0.0
```

A senha real do banco tem `@`, mas dentro da URL precisa virar `%40`.

Senha real:

```txt
LemeContratos_DB_2026@Seguro_47xP
```

Senha dentro da DATABASE_URL:

```txt
LemeContratos_DB_2026%40Seguro_47xP
```

## Domínio

No serviço `contratos-web`, configure:

```txt
Domínio: contratos.lememarketingmedico.com.br
Porta / Target Port / Proxy Port: 3000
```

Não coloque domínio no serviço `contratos-postgres`.

## Teste rápido

Depois do deploy, teste:

```txt
https://contratos.lememarketingmedico.com.br/api/health
```

Se abrir uma resposta parecida com abaixo, o app está online:

```json
{"ok":true,"app":"leme-contratos"}
```

Se o navegador mostrar `Not Found`, o domínio não está apontado para o serviço `contratos-web`, ou a porta do domínio não está como 3000.

Se o serviço ficar amarelo, abra os logs do `contratos-web`.


# Erro Prisma libssl/openssl

Se aparecer nos logs:

```txt
Prisma failed to detect the libssl/openssl version
Error: Schema engine error
```

Use esta versão corrigida do ZIP. O Dockerfile instala `openssl` e `ca-certificates`, e o `schema.prisma` foi ajustado para `debian-openssl-3.0.x`.

Depois de subir o código novo no GitHub, faça **Redeploy sem cache**, se o EasyPanel tiver essa opção. Se não tiver, faça um redeploy normal.
