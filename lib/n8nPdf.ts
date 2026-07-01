type N8nPdfPayload = {
  html: string;
  filename: string;
  meta?: Record<string, unknown>;
};

function getWebhookUrl() {
  return (process.env.N8N_PDF_WEBHOOK_URL || process.env.PDF_WEBHOOK_URL || '').trim();
}

function getWebhookToken() {
  return (process.env.N8N_PDF_WEBHOOK_TOKEN || process.env.PDF_WEBHOOK_TOKEN || '').trim();
}

function parseMaybeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractBase64Pdf(json: any): string | null {
  return (
    json?.pdfBase64 ||
    json?.base64 ||
    json?.pdf ||
    json?.data ||
    json?.body?.pdfBase64 ||
    json?.body?.base64 ||
    json?.body?.pdf ||
    json?.body?.data ||
    null
  );
}

function extractDownloadUrl(json: any): string | null {
  return json?.downloadUrl || json?.url || json?.body?.downloadUrl || json?.body?.url || null;
}

export function isN8nPdfConfigured() {
  return Boolean(getWebhookUrl());
}

export async function htmlToPdfViaN8n(payload: N8nPdfPayload): Promise<Buffer> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error('N8N_PDF_WEBHOOK_URL não está configurada no EasyPanel. Crie o webhook no n8n e cole a URL nas variáveis do contratos-web.');
  }

  const token = getWebhookToken();
  const timeoutMs = Number(process.env.N8N_PDF_TIMEOUT_MS || 120000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-leme-pdf-token': token } : {})
      },
      body: JSON.stringify({
        source: 'leme-contratos',
        action: 'generate_contract_pdf',
        filename: payload.filename,
        html: payload.html,
        meta: payload.meta || {}
      })
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`O webhook do n8n respondeu com erro HTTP ${response.status}. Retorno: ${text.slice(0, 2000)}`);
    }

    if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
      return Buffer.from(await response.arrayBuffer());
    }

    const text = await response.text();
    const json = parseMaybeJson(text);

    if (json) {
      const base64 = extractBase64Pdf(json);
      if (base64 && typeof base64 === 'string') {
        return Buffer.from(base64.replace(/^data:application\/pdf;base64,/, ''), 'base64');
      }

      const downloadUrl = extractDownloadUrl(json);
      if (downloadUrl) {
        const pdfResponse = await fetch(downloadUrl);
        if (!pdfResponse.ok) {
          throw new Error(`O n8n retornou uma URL de PDF, mas o download falhou com HTTP ${pdfResponse.status}.`);
        }
        return Buffer.from(await pdfResponse.arrayBuffer());
      }
    }

    throw new Error(`O n8n respondeu, mas não retornou um PDF. Retorno recebido: ${text.slice(0, 2000)}`);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Tempo esgotado ao chamar o webhook do n8n após ${timeoutMs}ms.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
