/**
 * Buscador del sitio. Tolera errores de tipeo, busca por prefijo mientras se
 * escribe e ignora tildes y mayúsculas («cedron» encuentra «Cedrón»).
 */
import MiniSearch from 'minisearch';

interface Doc {
  id: string;
  tipo: 'planta' | 'hongo' | 'uso' | 'receta' | 'preparacion' | 'tema' | 'glosario';
  titulo: string;
  detalle: string;
  url: string;
  claves: string;
  texto: string;
}

const GRUPOS: { tipos: Doc['tipo'][]; titulo: string }[] = [
  { tipos: ['planta', 'hongo'], titulo: 'Plantas y hongos' },
  { tipos: ['uso'], titulo: 'Para qué' },
  { tipos: ['receta'], titulo: 'Recetas' },
  { tipos: ['preparacion'], titulo: 'Preparaciones' },
  { tipos: ['tema'], titulo: 'Temas del taller' },
  { tipos: ['glosario'], titulo: 'Glosario' },
];

/** Palabras que no ayudan a buscar. */
const VACIAS = new Set(
  'a al algo con como de del el en es la las lo los me mi mis para por que se sin su sus un una unos unas y o u tengo quiero algo hay esta este esto ese esa'.split(
    ' ',
  ),
);

export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n');

let indice: Promise<MiniSearch<Doc>> | undefined;

function cargarIndice() {
  indice ??= fetch('/indice-busqueda.json')
    .then((r) => r.json() as Promise<Doc[]>)
    .then((docs) => {
      const ms = new MiniSearch<Doc>({
        fields: ['titulo', 'claves', 'texto'],
        storeFields: ['tipo', 'titulo', 'detalle', 'url'],
        processTerm: (t) => {
          const n = normalizar(t).replace(/[^a-z0-9]/g, '');
          return n.length > 1 && !VACIAS.has(n) ? n : null;
        },
        searchOptions: {
          boost: { titulo: 5, claves: 3, texto: 1 },
          prefix: (t) => t.length > 2,
          fuzzy: (t) => (t.length > 6 ? 0.25 : t.length > 3 ? 0.2 : false),
          weights: { fuzzy: 0.6, prefix: 0.8 },
        },
      });
      ms.addAll(docs);
      return ms;
    });
  return indice;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function pintarResultados(cont: HTMLElement, consulta: string, res: (Doc & { score: number })[], nivel: 'h2' | 'h3') {
  if (!res.length) {
    cont.innerHTML = `<div class="sin-resultados"><p>No encontré nada con «${esc(consulta)}».</p>
      <p>Probá con el nombre de la planta o con lo que te pasa, por ejemplo <em>dormir</em>, <em>gases</em> o <em>tos</em>.
      También podés mirar <a href="/plantas/">todas las plantas</a> o <a href="/usos/">buscar por uso</a>.</p></div>`;
    return;
  }
  const partes: string[] = [`<p class="resultados__estado" role="status">${res.length === 1 ? '1 resultado' : `${res.length} resultados`} para «${esc(consulta)}»</p>`];
  for (const g of GRUPOS) {
    const items = res.filter((r) => g.tipos.includes(r.tipo));
    if (!items.length) continue;
    partes.push(`<section class="resultados__grupo"><${nivel}>${g.titulo}</${nivel}><ul>`);
    for (const r of items.slice(0, 12)) {
      const detalle = r.tipo === 'planta' || r.tipo === 'hongo' ? `<i>${esc(r.detalle)}</i>${r.tipo === 'hongo' ? ' · hongo' : ''}` : esc(r.detalle);
      partes.push(
        `<li><a class="resultado" href="${r.url}"><span class="resultado__titulo">${esc(r.titulo)}</span><span class="resultado__detalle">${detalle}</span></a></li>`,
      );
    }
    partes.push('</ul></section>');
  }
  cont.innerHTML = partes.join('');
}

export function iniciarBuscador(raiz: HTMLElement) {
  const campo = raiz.querySelector<HTMLInputElement>('input[type="search"]')!;
  const borrar = raiz.querySelector<HTMLButtonElement>('.buscador__borrar')!;
  const cont = raiz.querySelector<HTMLElement>('.resultados')!;
  const nivel = (raiz.dataset.nivel as 'h2' | 'h3') ?? 'h2';
  const sincronizarUrl = raiz.dataset.url === 'si';
  let turno = 0;

  async function buscar() {
    const consulta = campo.value.trim();
    borrar.hidden = consulta.length === 0;
    if (sincronizarUrl) {
      const u = new URL(location.href);
      if (consulta) u.searchParams.set('q', consulta);
      else u.searchParams.delete('q');
      history.replaceState(null, '', u);
    }
    if (consulta.length < 2) {
      cont.innerHTML = '';
      return;
    }
    const mio = ++turno;
    const ms = await cargarIndice();
    if (mio !== turno) return;
    let res = ms.search(consulta, { combineWith: 'AND' }) as unknown as (Doc & { score: number })[];
    if (!res.length) res = ms.search(consulta, { combineWith: 'OR' }) as unknown as (Doc & { score: number })[];
    pintarResultados(cont, consulta, res, nivel);
  }

  let espera: number | undefined;
  campo.addEventListener('input', () => {
    clearTimeout(espera);
    espera = window.setTimeout(buscar, 120);
  });
  campo.addEventListener('focus', () => void cargarIndice(), { once: true });
  borrar.addEventListener('click', () => {
    campo.value = '';
    buscar();
    campo.focus();
  });
  raiz.querySelector('form')?.addEventListener('submit', (e) => {
    if (raiz.dataset.destino) return; // formulario que lleva a /buscar/
    e.preventDefault();
    buscar();
  });

  const inicial = new URL(location.href).searchParams.get('q');
  if (inicial && sincronizarUrl) {
    campo.value = inicial;
    buscar();
  }
}
