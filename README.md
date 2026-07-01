# LEME Contratos

Sistema interno da LEME para preencher contratos de prestação de serviços de marketing digital e exportar em PDF.


## Configuração exata pelo print enviado

Pelo print do EasyPanel, use esta `DATABASE_URL` no serviço do app:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratos_DB_2026%40Seguro_47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
```

A senha real continua sendo `LemeContratos_DB_2026@Seguro_47xP`. O `%40` entra somente dentro da `DATABASE_URL`.

Também deixei o arquivo `EASYPANEL-CONFIG.md` com essa configuração pronta para consulta.

## O que já vem pronto

- Login com usuário administrador.
- Dashboard.
- Modo escuro e modo claro.
- Identidade visual com o logo da LEME.
- Cadastro automático de clientes ao gerar contrato.
- Predefinições de responsáveis, como Luis e Matheus.
- Configurações fixas da empresa.
- Geração de PDF do contrato.
- Histórico de contratos.
- Controle de status: Rascunho, Gerado, Enviado, Assinado e Cancelado.
- Dockerfile pronto para EasyPanel.
- PostgreSQL com Prisma.
- Script de inicialização com tentativas automáticas de conexão com o banco.

## Stack

- Next.js
- PostgreSQL
- Prisma
- PDFKit
- Docker

## Nomes recomendados quando for colocar dentro de um projeto já existente no EasyPanel

Use nomes específicos para não misturar com outros sistemas:

- Repositório no GitHub: `leme-contratos`
- Serviço da aplicação no EasyPanel: `contratos-web`
- Serviço PostgreSQL no EasyPanel: `contratos-postgres`
- Nome do banco: `leme_contratos`
- Usuário do banco: `leme_contratos_user`

Se o EasyPanel criar um host interno com o nome completo do projeto, por exemplo `sistema-leme_contratos-postgres`, use exatamente esse host na `DATABASE_URL`.

## Senhas sugeridas sem caracteres problemáticos

Para evitar erro na `DATABASE_URL`, estas senhas não têm `@`:

- Senha do banco: `LemeContratosDB2026Seguro47xP`
- APP_SECRET: `LemeContratosAppSecret2026LEME_x9Pq72`
- E-mail administrador: `agencia.digital.leme@gmail.com`
- Senha administrador: `LemeContratosAdmin2026PrimeiroAcesso`

Se você usar uma senha com `@`, precisa trocar o `@` por `%40` apenas dentro da `DATABASE_URL`.

Exemplo:

```txt
Senha real do banco: LemeContratos_DB_2026@Seguro_47xP
Senha dentro da URL: LemeContratos_DB_2026%40Seguro_47xP
```

## Variáveis de ambiente para o EasyPanel

No serviço `contratos-web`, configure:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratosDB2026Seguro47xP@contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratosAppSecret2026LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratosAdmin2026PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

Se o host interno do banco no EasyPanel aparecer como `sistema-leme_contratos-postgres`, use:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratosDB2026Seguro47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratosAppSecret2026LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratosAdmin2026PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

Se você já criou o banco com a senha `LemeContratos_DB_2026@Seguro_47xP`, a variável correta fica assim:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratos_DB_2026%40Seguro_47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratos_AppSecret_2026@LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratos_Admin_2026@PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

Atenção: o `@` da senha do banco foi trocado por `%40` somente na `DATABASE_URL`.

## Passo a passo para subir no GitHub

1. Baixe e descompacte o ZIP.
2. Entre na pasta `leme-contratos`.
3. Acesse o GitHub e crie um repositório novo chamado `leme-contratos`.
4. Não marque para criar README, `.gitignore` ou licença pelo GitHub, porque esses arquivos já existem no projeto.
5. Abra o terminal dentro da pasta do projeto.
6. Rode os comandos abaixo:

```bash
git init
git add .
git commit -m "primeira versao leme contratos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/leme-contratos.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu usuário ou organização do GitHub.

## Passo a passo no EasyPanel dentro de um projeto já existente

### 1. Criar o banco PostgreSQL do sistema de contratos

1. Entre no projeto já existente da LEME no EasyPanel.
2. Clique em `+ Service`.
3. Escolha PostgreSQL.
4. Nome do serviço: `contratos-postgres`.
5. Database: `leme_contratos`.
6. User: `leme_contratos_user`.
7. Password: `LemeContratosDB2026Seguro47xP`.
8. Crie o serviço.

Se você preferir manter a senha antiga com `@`, lembre de codificar esse caractere na `DATABASE_URL` usando `%40`.

### 2. Criar o app web

1. Dentro do mesmo projeto, clique em `+ Service`.
2. Escolha `App`.
3. Nome do serviço: `contratos-web`.
4. Em source, escolha GitHub.
5. Conecte o repositório `leme-contratos`.
6. Branch: `main`.
7. Build usando Dockerfile. O arquivo `Dockerfile` já está na raiz.
8. Proxy port: `3000`.

### 3. Configurar as variáveis de ambiente

No serviço `contratos-web`, cole as variáveis:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratosDB2026Seguro47xP@contratos-postgres:5432/leme_contratos?schema=public
APP_SECRET=LemeContratosAppSecret2026LEME_x9Pq72
ADMIN_NAME=Matheus - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=LemeContratosAdmin2026PrimeiroAcesso
NEXT_PUBLIC_APP_URL=https://contratos.lememarketingmedico.com.br
```

Se o EasyPanel mostrar que o host interno do banco é `sistema-leme_contratos-postgres`, troque apenas o host da `DATABASE_URL`:

```env
DATABASE_URL=postgresql://leme_contratos_user:LemeContratosDB2026Seguro47xP@sistema-leme_contratos-postgres:5432/leme_contratos?schema=public
```

### 4. Configurar domínio

1. No DNS do seu domínio, crie um registro A.
2. Nome: `contratos`.
3. Valor: IP da sua VPS.
4. No EasyPanel, abra o serviço `contratos-web`.
5. Vá em Domains.
6. Adicione `contratos.lememarketingmedico.com.br`.
7. Confirme que o proxy port está como `3000`.
8. Ative o SSL, se necessário.

### 5. Fazer deploy

1. Clique em Deploy no serviço `contratos-web`.
2. O sistema vai instalar dependências, gerar o Prisma Client, rodar as migrations, criar o usuário administrador e iniciar a aplicação.
3. Acesse o domínio configurado.
4. Faça login com:

```txt
E-mail: agencia.digital.leme@gmail.com
Senha: LemeContratosAdmin2026PrimeiroAcesso
```

Se você manteve a senha antiga de admin nas variáveis, use a senha antiga.

## Como conferir se deu certo

Nos logs do `contratos-web`, você deve ver algo próximo de:

```txt
Iniciando LEME Contratos...
Aplicando migrations do banco...
Criando/atualizando usuário administrador e dados iniciais...
LEME Contratos pronto. Subindo Next.js na porta 3000...
```

Se aparecer erro de conexão com PostgreSQL, revise a `DATABASE_URL`.

Os erros mais comuns são:

1. Usar `@` na senha sem transformar em `%40`.
2. Usar o host errado do banco.
3. Criar o banco com outro nome.
4. Criar o usuário com outro nome.
5. Usar uma senha na `DATABASE_URL` diferente da senha real do PostgreSQL.

## Primeiro uso

1. Entre em `Configurações`.
2. Revise os dados fixos da LEME.
3. Entre em `Predefinições`.
4. Complete os dados do Luis e do Matheus.
5. Vá em `Novo contrato`.
6. Escolha uma predefinição.
7. Preencha os dados do cliente.
8. Clique em `Gerar contrato em PDF`.
9. Na tela do contrato, clique em `Baixar PDF`.

## Como rodar localmente, opcional

Se quiser testar no computador antes da VPS:

```bash
docker compose up --build
```

Depois acesse:

```txt
http://localhost:3000
```

Login local:

```txt
E-mail: agencia.digital.leme@gmail.com
Senha: LemeLocal@123456
```

## Como editar o texto do contrato

O texto usado para gerar o PDF está neste arquivo:

```txt
lib/contractPdf.ts
```

Ali estão as cláusulas do contrato. Sempre que alterar uma cláusula, salve, suba para o GitHub e faça novo deploy.

## Observação importante

Este sistema automatiza o preenchimento e a geração do PDF. Antes de usar oficialmente com clientes, revise o contrato com um advogado para garantir que todas as cláusulas, prazos, multas, dados e responsabilidades estejam corretos para a operação da LEME.


## Correção importante para EasyPanel e Prisma

Este projeto usa Prisma com PostgreSQL. No Dockerfile já foi incluída a instalação de `openssl` e `ca-certificates`, porque sem isso o EasyPanel pode mostrar o erro:

```txt
Prisma failed to detect the libssl/openssl version
Error: Schema engine error
```

Também foi configurado o Prisma para usar `debian-openssl-3.0.x`, compatível com a imagem `node:20-bookworm-slim`.

No primeiro deploy, o sistema usa:

```bash
npx prisma db push --skip-generate
```

Isso cria as tabelas automaticamente no banco `leme_contratos`, sem depender de uma pasta de migrations.

### DATABASE_URL correta para a senha com @

Se a senha real do banco for:

```txt
LemeContratos_DB_2026@Seguro_47xP
```

Dentro da URL ela precisa ficar assim:

```txt
LemeContratos_DB_2026%40Seguro_47xP
```

Use no app `contratos-web`:

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

---

# Atualização V7: PDF via n8n + Gotenberg

A geração de PDF agora pode ser feita pelo n8n usando Gotenberg. Isso evita problemas de PDF dentro do container do Next.js.

No EasyPanel, no serviço `contratos-web`, adicione:

```env
N8N_PDF_WEBHOOK_URL=https://SEU-N8N/webhook/leme-contratos-pdf
N8N_PDF_WEBHOOK_TOKEN=LemeContratosPDF_2026_seguro
N8N_PDF_TIMEOUT_MS=120000
```

Enquanto estiver testando no editor do n8n, use `webhook-test`. Depois de ativar o workflow, use `webhook`.

O passo a passo completo está no arquivo:

```txt
N8N-GOTENBERG-PDF.md
```

Rota de teste:

```txt
https://contratos.lememarketingmedico.com.br/api/health/n8n-pdf
```

Se essa rota baixar um PDF, o fluxo n8n + Gotenberg está funcionando.

## V8: correção Prisma + n8n WhatsApp

Se o EasyPanel mostrar que está baixando `prisma@7.x`, faça deploy desta versão V8 e use rebuild sem cache.

O projeto usa Prisma 5.22.0 fixado. O Dockerfile chama o binário local `./node_modules/.bin/prisma`, evitando que o `npx` baixe a versão mais nova.

Também foi incluído o workflow completo do n8n em:

```txt
n8n/leme-contratos-pdf-whatsapp.json
```

Esse workflow recebe o HTML do sistema, gera PDF no Gotenberg, envia no WhatsApp pela Evolution API e devolve o PDF em base64 para o sistema baixar no navegador.
