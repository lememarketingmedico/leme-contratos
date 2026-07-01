export function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
}

export function parseMoneyToCents(value: string) {
  const cleaned = String(value || '')
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const number = Number(cleaned);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * 100);
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function onlyDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

function numberUnderThousand(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cem';

  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];

  if (h > 0) parts.push(hundreds[h]);

  if (rest >= 10 && rest <= 19) {
    parts.push(teens[rest - 10]);
  } else {
    const t = Math.floor(rest / 10);
    const u = rest % 10;
    if (t > 0) parts.push(tens[t]);
    if (u > 0) parts.push(units[u]);
  }

  return parts.join(' e ');
}

function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 1000) return numberUnderThousand(n);

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const thousandText = thousands === 1 ? 'mil' : `${numberUnderThousand(thousands)} mil`;
  if (rest === 0) return thousandText;
  return `${thousandText} e ${numberUnderThousand(rest)}`;
}

export function valueToWordsBRL(cents: number) {
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  const reaisText = `${integerToWords(reais)} ${reais === 1 ? 'real' : 'reais'}`;

  if (centavos === 0) return reaisText;
  return `${reaisText} e ${integerToWords(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`;
}

export const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho',
  GENERATED: 'Gerado',
  SENT: 'Enviado',
  SIGNED: 'Assinado',
  CANCELED: 'Cancelado'
};
