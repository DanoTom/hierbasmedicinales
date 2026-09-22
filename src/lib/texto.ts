/**
 * Texto con formato mínimo: párrafos separados por una línea en blanco,
 * **negrita**, *cursiva* y [enlaces](/ruta/). Todo lo demás se escapa.
 */

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function enLinea(texto: string): string {
  return escapar(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, ' ');
}

export function parrafos(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(enLinea);
}

/** Texto plano (sin marcas), para el buscador y las descripciones. */
export function plano(texto: string): string {
  return texto.replace(/\*\*|\*/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
}

/** Minúsculas y sin tildes: «Cedrón» → «cedron». La usa también el buscador del navegador. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n');
}

/** Primera letra en mayúscula. */
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
