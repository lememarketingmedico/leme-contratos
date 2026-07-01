# Correção V8: Prisma no EasyPanel

O EasyPanel estava usando cache do Docker e o comando `npx prisma generate` acabou baixando o Prisma 7 automaticamente.

Nesta versão:

- `package.json` fixa `prisma` e `@prisma/client` em `5.22.0`.
- `Dockerfile` usa `npm ci --include=dev`.
- `Dockerfile` chama `./node_modules/.bin/prisma generate`, não `npx prisma generate`.
- `scripts/start.sh` chama `./node_modules/.bin/prisma db push --skip-generate`, não `npx prisma db push`.

Isso evita o erro:

```txt
Prisma schema validation P1012
The datasource property `url` is no longer supported in schema files
Prisma CLI Version : 7.8.0
```

Esse erro acontecia porque o Prisma 7 foi baixado sem querer. O projeto foi feito para Prisma 5.22.0.
