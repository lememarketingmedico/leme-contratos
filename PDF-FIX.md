# Correção V6 - erro 500 ao baixar PDF

Esta versão corrige e melhora a rota de PDF:

- Mantém o PDFKit como pacote externo do servidor no Next.js.
- Força a rota de PDF a rodar em Node.js e sem cache.
- Cria automaticamente os dados da LEME caso a configuração da empresa não exista no banco.
- Protege a geração do cabeçalho caso o arquivo de logo esteja ausente ou inválido.
- Adiciona mensagem de erro legível se ainda houver falha.
- Adiciona uma rota de teste: `/api/health/pdf`.

Depois do deploy, teste primeiro:

```txt
https://contratos.lememarketingmedico.com.br/api/health/pdf
```

Se baixar o PDF de teste, o PDFKit está funcionando.

Depois teste baixar um contrato real.

Se ainda aparecer erro 500, a página agora deve mostrar uma mensagem em texto. Copie a mensagem e os logs do EasyPanel.
