# V9 — correção do build no EasyPanel

O V8 falhou porque o `npm ci` travou com `Exit handler never called` e terminou sem criar o binário local do Prisma em `node_modules/.bin/prisma`.

Na V9 o Dockerfile foi ajustado para:

- copiar somente `package.json` antes da instalação;
- ignorar `package-lock.json` durante o build;
- forçar registry público `https://registry.npmjs.org/`;
- atualizar o npm para `10.9.2`;
- usar `npm install --package-lock=false`;
- conferir se `./node_modules/.bin/prisma` existe antes de continuar;
- continuar usando Prisma 5.22.0, fixado no `package.json`.

No EasyPanel, faça redeploy com rebuild sem cache.
