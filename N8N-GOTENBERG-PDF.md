# PDF via n8n + Gotenberg

Esta versão do LEME Contratos não gera mais o PDF dentro do Next.js.
Quando você clica em **Baixar PDF**, o sistema envia o HTML do contrato para um webhook do n8n.
O n8n chama o Gotenberg, converte o HTML em PDF e responde para o sistema com o arquivo PDF.

## Variáveis no EasyPanel

No serviço `contratos-web`, adicione:

```env
N8N_PDF_WEBHOOK_URL=https://SEU-N8N/webhook/leme-contratos-pdf
N8N_PDF_WEBHOOK_TOKEN=LemeContratosPDF_2026_seguro
N8N_PDF_TIMEOUT_MS=120000
```

Se estiver testando pelo editor do n8n, use a URL de teste:

```env
N8N_PDF_WEBHOOK_URL=https://SEU-N8N/webhook-test/leme-contratos-pdf
```

Depois que ativar o workflow, troque para a URL de produção:

```env
N8N_PDF_WEBHOOK_URL=https://SEU-N8N/webhook/leme-contratos-pdf
```

## Estrutura do workflow no n8n

Crie um workflow chamado:

```txt
LEME Contratos - Gerar PDF Gotenberg
```

### 1. Webhook

- Method: `POST`
- Path: `leme-contratos-pdf`
- Response: `Using Respond to Webhook node`

O sistema vai enviar JSON assim:

```json
{
  "source": "leme-contratos",
  "action": "generate_contract_pdf",
  "filename": "contrato-0001-cliente",
  "html": "<!doctype html>...",
  "meta": {
    "contractId": "...",
    "contractNumber": "...",
    "clientName": "..."
  }
}
```

### 2. Code node: Transformar HTML em arquivo

Nome do node:

```txt
HTML para arquivo
```

Código:

```js
const body = $json.body || $json;
const html = body.html;
const filename = (body.filename || 'contrato-leme').replace(/\.pdf$/i, '');

if (!html) {
  throw new Error('O campo html não chegou no webhook.');
}

return [
  {
    json: {
      filename,
      meta: body.meta || {}
    },
    binary: {
      data: {
        data: Buffer.from(html, 'utf8').toString('base64'),
        mimeType: 'text/html',
        fileName: 'index.html'
      }
    }
  }
];
```

### 3. HTTP Request: chamar Gotenberg

Nome do node:

```txt
Gotenberg PDF
```

Configuração:

- Method: `POST`
- URL: `http://gotenberg:3000/forms/chromium/convert/html`
- Body Content Type: `Form-Data Multipart`
- Send Binary Data: ativado, se a sua versão mostrar essa opção
- Campo do arquivo: `files`
- Binary Property: `data`
- Response Format: `File`
- Output Binary Property: `pdf`

Em algumas versões do n8n, a configuração aparece como **Body Parameters**:

```txt
Parameter Type: n8n Binary File
Name: files
Input Data Field Name: data
```

### 4. Respond to Webhook

Nome do node:

```txt
Responder PDF
```

Configuração:

- Respond With: `Binary File`
- Response Data Source: `pdf`
- Header `Content-Type`: `application/pdf`

Se existir campo para filename, use:

```txt
{{$json.filename}}.pdf
```

## Teste

Depois de salvar e ativar o workflow, teste no navegador:

```txt
https://contratos.lememarketingmedico.com.br/api/health/n8n-pdf
```

Se baixar um PDF de teste, o fluxo está certo.

Depois teste o contrato real clicando em **Baixar PDF** dentro do sistema.
