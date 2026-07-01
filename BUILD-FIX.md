# Correção V4 - imports sem alias

Esta versão remove os imports com `@/` e usa caminhos relativos.

Motivo: no build do EasyPanel, o Next.js não estava resolvendo `@/lib/...`, mesmo com `baseUrl` configurado.

Também foi adicionado no Dockerfile um teste para confirmar que os arquivos principais existem antes do build:

- `lib/db.ts`
- `lib/auth.ts`
- `lib/contractPdf.ts`
