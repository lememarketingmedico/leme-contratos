# Correção V3 - erro Can't resolve '@/lib/...'

Este pacote adiciona `baseUrl: "."` no `tsconfig.json` para que o Next.js resolva corretamente os imports com alias `@/` durante o build no Docker/EasyPanel.

Depois de subir no GitHub, faça redeploy no EasyPanel. Se existir opção, use rebuild sem cache.
