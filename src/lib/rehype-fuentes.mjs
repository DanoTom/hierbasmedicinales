/**
 * Plugin para los temas en Markdown:
 * - convierte un párrafo que dice «[[fuente: guia-inmunidad/4-5]]» en una
 *   nota de procedencia con formato;
 * - agrega a cada celda de las tablas el rótulo de su columna
 *   (data-rotulo), para que en el celular cada fila se lea como una ficha.
 */
const DOCS = {
  'guia-digestiva': ['Guía digestiva', 'pág.', 'págs.'],
  'taller-digestivo': ['Diapositivas del taller digestivo', 'diap.', 'diaps.'],
  'taller-estres': ['Taller de estrés y descanso', 'diap.', 'diaps.'],
  'guia-inmunidad': ['Guía Inmunidad inteligente', 'pág.', 'págs.'],
};

function formatear(refs) {
  return refs
    .map((r) => {
      const [doc, pags] = r.trim().split('/');
      const d = DOCS[doc];
      if (!d || !pags) throw new Error(`Fuente desconocida en un tema: «${r}»`);
      const rango = pags.includes('-');
      return `${d[0]}, ${rango ? d[2] : d[1]} ${pags.replace('-', '–')}`;
    })
    .join(' · ');
}

function recorrer(nodo, fn) {
  if (!nodo.children) return;
  nodo.children = nodo.children.map((hijo) => fn(hijo) ?? hijo);
  nodo.children.forEach((hijo) => recorrer(hijo, fn));
}

const textoDe = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(textoDe).join(''));

function rotularTabla(tabla) {
  const filas = [];
  const juntar = (n) => {
    if (n.type === 'element' && n.tagName === 'tr') filas.push(n);
    else (n.children ?? []).forEach(juntar);
  };
  juntar(tabla);
  const [cabecera, ...resto] = filas;
  if (!cabecera) return;
  const rotulos = cabecera.children.filter((c) => c.type === 'element').map((c) => textoDe(c).trim());
  for (const fila of resto) {
    fila.children
      .filter((c) => c.type === 'element')
      .forEach((celda, i) => {
        celda.properties = { ...celda.properties, dataRotulo: rotulos[i] ?? '' };
      });
  }
}

export default function rehypeFuentes() {
  return (arbol) => {
    recorrer(arbol, (nodo) => {
      if (nodo.type === 'element' && nodo.tagName === 'table') rotularTabla(nodo);
    });
    recorrer(arbol, (nodo) => {
      if (nodo.type !== 'element' || nodo.tagName !== 'p' || nodo.children?.length !== 1) return;
      const t = nodo.children[0];
      if (t.type !== 'text') return;
      const m = /^\[\[fuente:\s*(.+)\]\]$/.exec(t.value.trim());
      if (!m) return;
      return {
        type: 'element',
        tagName: 'p',
        properties: { className: ['fuente'] },
        children: [
          { type: 'element', tagName: 'span', properties: { className: ['fuente__rotulo'] }, children: [{ type: 'text', value: 'Fuente: ' }] },
          { type: 'text', value: formatear(m[1].split(',')) },
        ],
      };
    });
  };
}
