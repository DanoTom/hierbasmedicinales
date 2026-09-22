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
  alertas?: string[];
  precauciones?: string;
}

/** Palabras relacionadas con cada precaución, para reconocerlas en lo que se busca. */
const SINONIMOS_ALERTA: Record<string, string[]> = {
  embarazo: ['embarazo', 'embarazada', 'embarazadas', 'gestacion'],
  lactancia: ['lactancia', 'amamantar', 'amamantando', 'teta'],
  'ninas y ninos': ['nino', 'ninos', 'nina', 'ninas', 'chicos', 'bebe', 'bebes', 'infantil'],
  anticoagulantes: ['anticoagulante', 'anticoagulantes', 'warfarina', 'aspirina', 'sangre'],
  'presion arterial': ['presion', 'hipertension', 'antihipertensivo', 'antihipertensivos'],
  tiroides: ['tiroides', 'hipotiroidismo', 'hipertiroidismo', 'levotiroxina'],
  diabetes: ['diabetes', 'diabetico', 'diabetica', 'azucar', 'glucemia'],
  'cirugia programada': ['cirugia', 'operacion', 'operar', 'anestesia'],
  higado: ['higado', 'hepatico', 'hepatica'],
  'sedantes o ansioliticos': ['sedante', 'sedantes', 'ansiolitico', 'ansioliticos', 'clonazepam', 'alprazolam', 'pastillas para dormir'],
};

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
        fields: ['titulo', 'claves', 'texto', 'precauciones'],
        storeFields: ['tipo', 'titulo', 'detalle', 'url', 'alertas'],
        processTerm: (t) => {
          const n = normalizar(t).replace(/[^a-z0-9]/g, '');
          return n.length > 1 && !VACIAS.has(n) ? n : null;
        },
        searchOptions: {
          boost: { titulo: 5, claves: 3, texto: 1, precauciones: 0.6 },
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

/** Precauciones de una planta que coinciden con lo que se buscó. */
function alertasQueCoinciden(alertas: string[] | undefined, terminos: string[]) {
  if (!alertas?.length) return [];
  return alertas.filter((a) => {
    const n = normalizar(a);
    const sinonimos = SINONIMOS_ALERTA[n] ?? [];
    return terminos.some((t) => t.length > 3 && (n.split(/\s+/).some((w) => w.startsWith(t) || t.startsWith(w)) || sinonimos.includes(t)));
  });
}

function pintarResultados(cont: HTMLElement, consulta: string, res: (Doc & { score: number })[], nivel: 'h2' | 'h3') {
  if (!res.length) {
    cont.innerHTML = `<div class="sin-resultados"><p>No encontré nada con «${esc(consulta)}».</p>
      <p>Probá con el nombre de la planta o con lo que te pasa, por ejemplo <em>dormir</em>, <em>gases</em> o <em>tos</em>.
      También podés mirar <a href="/plantas/">todas las plantas</a> o <a href="/usos/">buscar por uso</a>.</p></div>`;
    const estado = cont.closest('[data-buscador]')?.querySelector('[data-estado]');
    if (estado) estado.textContent = 'Sin resultados.';
    return;
  }
  const terminos = normalizar(consulta).split(/[^a-z0-9]+/).filter(Boolean);
  type Resultado = Doc & { score: number; match?: Record<string, string[]> };
  const enPrecauciones = (r: Resultado) => Object.values(r.match ?? {}).some((campos) => campos.includes('precauciones'));
  const coincidencias = new Map(
    (res as Resultado[]).map((r) => {
      const a = alertasQueCoinciden(r.alertas, terminos);
      return [r.id, a.length ? a : enPrecauciones(r) ? ['__texto__'] : []] as const;
    }),
  );
  const hayAlertas = [...coincidencias.values()].some((a) => a.length);
  const partes: string[] = [`<p class="resultados__estado">${res.length === 1 ? '1 resultado' : `${res.length} resultados`} para «${esc(consulta)}»</p>`];
  if (hayAlertas) {
    partes.push(`<div class="resultados__cuidado" role="note"><strong>Ojo:</strong> varias fichas nombran «${esc(consulta)}» entre sus <strong>precauciones</strong>, no como recomendación. Abrí cada una y leé las precauciones antes de usarla.</div>`);
  }
  for (const g of GRUPOS) {
    const items = res.filter((r) => g.tipos.includes(r.tipo));
    if (!items.length) continue;
    partes.push(`<section class="resultados__grupo"><${nivel}>${g.titulo}</${nivel}><ul>`);
    for (const r of items.slice(0, 12)) {
      const detalle = r.tipo === 'planta' || r.tipo === 'hongo' ? `<i>${esc(r.detalle)}</i>${r.tipo === 'hongo' ? ' · hongo' : ''}` : esc(r.detalle);
      const alertas = coincidencias.get(r.id) ?? [];
      const aviso = !alertas.length
        ? ''
        : alertas[0] === '__texto__'
          ? `<span class="resultado__alerta">Lo nombra en sus precauciones</span>`
          : `<span class="resultado__alerta">Tiene precauciones con: ${alertas.map((a) => esc(a.toLowerCase())).join(', ')}</span>`;
      partes.push(
        `<li><a class="resultado" href="${r.url}"><span class="resultado__titulo">${esc(r.titulo)}</span><span class="resultado__detalle">${detalle}</span>${aviso}</a></li>`,
      );
    }
    partes.push('</ul></section>');
  }
  cont.innerHTML = partes.join('');
  const estado = cont.closest('[data-buscador]')?.querySelector('[data-estado]');
  if (estado) estado.textContent = `${res.length === 1 ? '1 resultado' : `${res.length} resultados`}${hayAlertas ? '. Atención: algunas fichas lo nombran entre sus precauciones.' : ''}`;
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
