/**
 * Formateo de las referencias a las fuentes («guia-digestiva/5» →
 * «Guía digestiva, pág. 5»).
 */
import { DOCUMENTOS, type IdDocumento } from './vocabulario';

export interface RefParseada {
  doc: IdDocumento;
  desde: number;
  hasta: number;
}

export function parsearRef(ref: string): RefParseada {
  const [doc, pags] = ref.split('/');
  const [desde, hasta] = pags.split('-').map(Number);
  return { doc: doc as IdDocumento, desde, hasta: hasta ?? desde };
}

/** «Guía digestiva, pág. 5» / «Taller de estrés y descanso, diaps. 6–7» */
export function textoRef(ref: string): string {
  const { doc, desde, hasta } = parsearRef(ref);
  const d = DOCUMENTOS[doc];
  return desde === hasta ? `${d.corto}, ${d.unidad} ${desde}` : `${d.corto}, ${d.unidades} ${desde}–${hasta}`;
}

/**
 * Agrupa varias referencias por documento:
 * [guia-digestiva/5, guia-digestiva/13, taller-digestivo/6]
 * → «Guía digestiva, págs. 5 y 13 · Diapositivas del taller digestivo, diap. 6»
 */
export function textoRefs(refs: readonly string[]): string {
  const porDoc = new Map<IdDocumento, string[]>();
  for (const r of refs) {
    const { doc, desde, hasta } = parsearRef(r);
    const lista = porDoc.get(doc) ?? [];
    const pag = desde === hasta ? String(desde) : `${desde}–${hasta}`;
    if (!lista.includes(pag)) lista.push(pag);
    porDoc.set(doc, lista);
  }
  return [...porDoc.entries()]
    .map(([doc, pags]) => {
      const d = DOCUMENTOS[doc];
      pags.sort((a, b) => parseInt(a) - parseInt(b));
      const plural = pags.length > 1 || pags[0].includes('–');
      const unidad = plural ? d.unidades : d.unidad;
      const lista = pags.length > 1 ? `${pags.slice(0, -1).join(', ')} y ${pags.at(-1)}` : pags[0];
      return `${d.corto}, ${unidad} ${lista}`;
    })
    .join(' · ');
}

/** Documentos distintos citados en una lista de referencias, en orden. */
export function documentosDe(refs: readonly string[]): IdDocumento[] {
  return [...new Set(refs.map((r) => parsearRef(r).doc))];
}
