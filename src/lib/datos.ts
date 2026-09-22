/**
 * Acceso a los datos y relaciones entre ellos (qué recetas usan una planta,
 * en qué categorías del taller aparece, qué plantas sirven para un uso…).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { normalizar } from './texto';

export type Planta = CollectionEntry<'plantas'>;
export type Receta = CollectionEntry<'recetas'>;
export type Uso = CollectionEntry<'usos'>;
export type Preparacion = CollectionEntry<'preparaciones'>;
export type Tema = CollectionEntry<'temas'>;
export type Categoria = CollectionEntry<'categorias'>;
export type Lamina = CollectionEntry<'laminas'>;

const porNombre = (a: { data: { nombre: string } }, b: { data: { nombre: string } }) =>
  normalizar(a.data.nombre).localeCompare(normalizar(b.data.nombre), 'es');

export const GRUPOS_USO = {
  digestion: 'Digestión',
  nervios: 'Nervios y descanso',
  defensas: 'Respiratorio y defensas',
  energia: 'Energía y mente',
} as const;

/** Temas que tienen su propia página fuera de /aprender/. */
export const TEMAS_APARTE = ['seguridad', 'el-taller'];

let cache: Awaited<ReturnType<typeof cargar>> | undefined;

async function cargar() {
  const [plantas, recetas, usos, preparaciones, temas, categorias, laminas, glosario] = await Promise.all([
    getCollection('plantas'),
    getCollection('recetas'),
    getCollection('usos'),
    getCollection('preparaciones'),
    getCollection('temas'),
    getCollection('categorias'),
    getCollection('laminas'),
    getCollection('glosario'),
  ]);
  plantas.sort(porNombre);
  recetas.sort((a, b) => a.data.orden - b.data.orden);
  usos.sort((a, b) => a.data.orden - b.data.orden);
  preparaciones.sort((a, b) => a.data.orden - b.data.orden);
  temas.sort((a, b) => a.data.orden - b.data.orden);
  categorias.sort((a, b) => a.data.orden - b.data.orden);
  glosario.sort((a, b) => normalizar(a.data.termino).localeCompare(normalizar(b.data.termino), 'es'));

  validarRelaciones({ plantas, recetas, usos, preparaciones, temas, categorias, laminas });
  return { plantas, recetas, usos, preparaciones, temas, categorias, laminas, glosario };
}

/** Falla el build si una ficha apunta a algo que no existe. */
function validarRelaciones(d: {
  plantas: Planta[];
  recetas: Receta[];
  usos: Uso[];
  preparaciones: Preparacion[];
  temas: Tema[];
  categorias: Categoria[];
  laminas: Lamina[];
}) {
  const errores: string[] = [];
  const idsPlantas = new Set(d.plantas.map((p) => p.id));
  const idsUsos = new Set(d.usos.map((u) => u.id));
  const idsRecetas = new Set(d.recetas.map((r) => r.id));
  const idsLaminas = new Set(d.laminas.map((l) => l.id));
  for (const p of d.plantas) {
    for (const u of p.data.indice.usos) if (!idsUsos.has(u)) errores.push(`plantas/${p.id}: uso desconocido «${u}»`);
    if (p.data.lamina && !idsLaminas.has(p.data.lamina)) errores.push(`plantas/${p.id}: lámina desconocida «${p.data.lamina}»`);
    const hayPrecauciones =
      p.data.contraindicaciones.length + p.data.efectosAdversos.length + p.data.interacciones.length + p.data.cuidados.length > 0;
    if (p.data.alertas.length && !hayPrecauciones) errores.push(`plantas/${p.id}: tiene alertas pero ningún texto de precaución que las respalde`);
  }
  for (const r of d.recetas) {
    for (const p of r.data.plantas) if (!idsPlantas.has(p)) errores.push(`recetas/${r.id}: planta desconocida «${p}»`);
    for (const u of r.data.usos) if (!idsUsos.has(u)) errores.push(`recetas/${r.id}: uso desconocido «${u}»`);
  }
  for (const pr of d.preparaciones)
    for (const r of pr.data.recetas) if (!idsRecetas.has(r)) errores.push(`preparaciones/${pr.id}: receta desconocida «${r}»`);
  for (const t of d.temas)
    for (const p of t.data.plantas) if (!idsPlantas.has(p)) errores.push(`temas/${t.id}: planta desconocida «${p}»`);
  for (const c of d.categorias)
    for (const f of c.data.filas) if (!idsPlantas.has(f.planta)) errores.push(`categorias/${c.id}: planta desconocida «${f.planta}»`);
  if (errores.length) throw new Error('Errores en los datos:\n  ' + errores.join('\n  '));
}

export async function datos() {
  cache ??= await cargar();
  return cache;
}

/** Número de etiqueta (Nº 01, Nº 02…) según el orden alfabético. */
export async function numeroDe(id: string) {
  const { plantas } = await datos();
  return String(plantas.findIndex((p) => p.id === id) + 1).padStart(2, '0');
}

export async function recetasDePlanta(id: string) {
  const { recetas } = await datos();
  return recetas.filter((r) => r.data.plantas.includes(id));
}

export async function categoriasDePlanta(id: string) {
  const { categorias } = await datos();
  return categorias
    .map((c) => ({ categoria: c, filas: c.data.filas.filter((f) => f.planta === id) }))
    .filter((x) => x.filas.length);
}

export async function plantasDeUso(uso: string) {
  const { plantas } = await datos();
  return plantas.filter((p) => p.data.indice.usos.includes(uso));
}

export async function recetasDeUso(uso: string) {
  const { recetas } = await datos();
  return recetas.filter((r) => r.data.usos.includes(uso));
}

export async function plantasDePreparacion(clave: string) {
  const { plantas } = await datos();
  return plantas.filter((p) => p.data.indice.preparaciones.includes(clave as never));
}

export async function laminaDe(p: Planta) {
  if (!p.data.lamina) return undefined;
  const { laminas } = await datos();
  return laminas.find((l) => l.id === p.data.lamina);
}

/** Resumen corto de para qué se usa (nombres de los usos del índice). */
export async function resumenUsos(p: Planta, max = 3) {
  const { usos } = await datos();
  const nombres = p.data.indice.usos
    .map((u) => usos.find((x) => x.id === u)?.data.nombre)
    .filter(Boolean) as string[];
  return nombres.slice(0, max);
}

/** Todas las referencias citadas en una ficha. */
export function refsDePlanta(p: Planta): string[] {
  const d = p.data;
  const refs: string[] = [];
  const sumar = (x?: { de?: string[] }) => x?.de && refs.push(...x.de);
  d.cientifico.forEach(sumar);
  d.otrosNombres.forEach(sumar);
  sumar(d.familia);
  sumar(d.compuestoActivo);
  sumar(d.acciones);
  d.partes.forEach(sumar);
  for (const lista of [d.usos, d.contraindicaciones, d.efectosAdversos, d.interacciones, d.cuidados, d.formaDeUso, d.comoActua, d.evidencia, d.recuadros])
    lista.forEach(sumar);
  return refs;
}
