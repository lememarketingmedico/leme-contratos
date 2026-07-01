# LEME Contratos

Sistema interno da LEME para preencher contratos de prestação de serviços de marketing digital e exportar em PDF.

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

## Stack

- Next.js
- PostgreSQL
- Prisma
- PDFKit
- Docker

## Nomes recomendados

Use estes nomes para manter tudo organizado:

- Repositório no GitHub: `leme-contratos`
- Projeto no EasyPanel: `leme-contratos`
- Serviço da aplicação no EasyPanel: `web`
- Serviço PostgreSQL no EasyPanel: `postgres`
- Nome do banco: `leme_contratos`
- Usuário do banco: `leme_user`

## Senhas sugeridas para o primeiro deploy

Você pode usar essas ou gerar outras:

- Senha do banco: `FCo6OltasPVSyFlwQ5sfY3UnXBwKrF6NxAsME0GT`
- APP_SECRET: `iDTNprvZyyrOcNI8eS03dVxDRN4ZsUNlkxCAFb6q`
- E-mail administrador: `agencia.digital.leme@gmail.com`
- Senha administrador: `H1TP6WKNvEzbNibwRYCXl9kX4QlNQYyQ1VztojIt`

Guarde essas senhas. Se mudar a senha administrador nas variáveis do EasyPanel e fizer redeploy, o seed atualiza a senha desse usuário.

## Variáveis de ambiente para o EasyPanel

No serviço `web`, configure:

```env
DATABASE_URL=postgresql://leme_user:FCo6OltasPVSyFlwQ5sfY3UnXBwKrF6NxAsME0GT@postgres:5432/leme_contratos?schema=public
APP_SECRET=iDTNprvZyyrOcNI8eS03dVxDRN4ZsUNlkxCAFb6q
ADMIN_NAME=Luis - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=H1TP6WKNvEzbNibwRYCXl9kX4QlNQYyQ1VztojIt
NEXT_PUBLIC_APP_URL=https://contratos.seudominio.com.br
```

Se o EasyPanel mostrar uma connection string interna diferente para o PostgreSQL, use a URL exibida por ele no lugar da `DATABASE_URL` acima.

## Passo a passo para subir no GitHub

1. Baixe e descompacte o ZIP.
2. Entre na pasta `leme-contratos`.
3. Acesse o GitHub e crie um repositório novo chamado `leme-contratos`.
4. Não marque para criar README, .gitignore ou licença pelo GitHub, porque esses arquivos já existem no projeto.
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

## Passo a passo no EasyPanel

### 1. Criar o projeto

1. Entre no EasyPanel.
2. Clique em `New Project`.
3. Nomeie o projeto como `leme-contratos`.

### 2. Criar o banco PostgreSQL

1. Dentro do projeto `leme-contratos`, clique em `+ Service`.
2. Escolha PostgreSQL.
3. Nome do serviço: `postgres`.
4. Database: `leme_contratos`.
5. User: `leme_user`.
6. Password: `FCo6OltasPVSyFlwQ5sfY3UnXBwKrF6NxAsME0GT`.
7. Crie o serviço.

### 3. Criar o app web

1. Dentro do mesmo projeto, clique em `+ Service`.
2. Escolha `App`.
3. Nome do serviço: `web`.
4. Em source, escolha GitHub.
5. Conecte o repositório `leme-contratos`.
6. Branch: `main`.
7. Build usando Dockerfile. O arquivo `Dockerfile` já está na raiz.
8. Proxy port: `3000`.

### 4. Configurar as variáveis de ambiente

No serviço `web`, cole as variáveis:

```env
DATABASE_URL=postgresql://leme_user:FCo6OltasPVSyFlwQ5sfY3UnXBwKrF6NxAsME0GT@postgres:5432/leme_contratos?schema=public
APP_SECRET=iDTNprvZyyrOcNI8eS03dVxDRN4ZsUNlkxCAFb6q
ADMIN_NAME=Luis - LEME
ADMIN_EMAIL=agencia.digital.leme@gmail.com
ADMIN_PASSWORD=H1TP6WKNvEzbNibwRYCXl9kX4QlNQYyQ1VztojIt
NEXT_PUBLIC_APP_URL=https://contratos.seudominio.com.br
```

Depois altere `NEXT_PUBLIC_APP_URL` para o domínio real.

### 5. Configurar domínio

1. No DNS do seu domínio, crie um registro A.
2. Nome: `contratos`.
3. Valor: IP da sua VPS.
4. No EasyPanel, abra o serviço `web`.
5. Vá em Domains.
6. Adicione `contratos.seudominio.com.br`.
7. Confirme que o proxy port está como `3000`.
8. Ative o SSL, se necessário.

### 6. Fazer deploy

1. Clique em Deploy no serviço `web`.
2. O sistema vai instalar dependências, gerar o Prisma Client, rodar as migrations, criar o usuário administrador e iniciar a aplicação.
3. Acesse o domínio configurado.
4. Faça login com:

```txt
E-mail: agencia.digital.leme@gmail.com
Senha: H1TP6WKNvEzbNibwRYCXl9kX4QlNQYyQ1VztojIt
```

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
