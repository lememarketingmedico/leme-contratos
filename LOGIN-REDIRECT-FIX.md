# Correção do login redirecionando para 0.0.0.0

Se ao fazer login o navegador abrir `https://0.0.0.0:3000/dashboard`, o problema é o proxy do EasyPanel informando o host interno para o Next.js.

Esta versão corrige isso usando `NEXT_PUBLIC_APP_URL` como base oficial dos redirecionamentos.

## Variáveis recomendadas no contratos-web

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

A variável mais importante para esta correção é:

```env
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

Ela não pode estar como `0.0.0.0`.
