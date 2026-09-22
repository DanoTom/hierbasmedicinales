/**
 * Índice del buscador: se genera al compilar con todas las plantas, usos,
 * recetas, preparaciones, temas y términos del glosario.
 */
import type { APIRoute } from 'astro';
import { datos, TEMAS_APARTE } from '../lib/datos';
import { plano } from '../lib/texto';
import { ALERTAS, PARTES, PREPARACIONES } from '../lib/vocabulario';

export interface DocBusqueda {
  id: string;
  tipo: 'planta' | 'hongo' | 'uso' | 'receta' | 'preparacion' | 'tema' | 'glosario';
  titulo: string;
  detalle: string;
  url: string;
  /** Nombres y sinónimos: pesan más que el texto. */
  claves: string;
  texto: string;
}

const recortar = (s: string, n = 4000) => (s.length > n ? s.slice(0, n) : s);

export const GET: APIRoute = async () => {
  const d = await datos();
  const docs: DocBusqueda[] = [];

  for (const p of d.plantas) {
    const x = p.data;
    const usos = x.indice.usos.map((u) => d.usos.find((y) => y.id === u)!);
    docs.push({
      id: `planta:${p.id}`,
      tipo: x.tipo === 'hongo' ? 'hongo' : 'planta',
      titulo: x.nombre,
      detalle: x.cientifico.map((c) => c.nombre).join(' · '),
      url: `/plantas/${p.id}/`,
      claves: [x.nombre, ...x.otrosNombres.map((o) => o.nombre), ...x.cientifico.map((c) => c.nombre)].join(' '),
      texto: plano(
        [
          ...usos.flatMap((u) => [u.data.nombre, ...u.data.buscar]),
          x.acciones?.lista.join(' ') ?? '',
          x.compuestoActivo?.texto ?? '',
          x.familia?.nombre ?? '',
          ...x.partes.map((pt) => PARTES[pt.parte]),
          ...x.indice.preparaciones.map((pr) => PREPARACIONES[pr]),
          ...x.alertas.map((a) => ALERTAS[a]),
          ...x.usos.map((u) => u.texto),
          ...x.formaDeUso.map((f) => f.texto),
        ].join(' '),
      ),
    });
  }

  for (const u of d.usos) {
    docs.push({
      id: `uso:${u.id}`,
      tipo: 'uso',
      titulo: u.data.nombre,
      detalle: u.data.descripcion,
      url: `/usos/${u.id}/`,
      claves: [u.data.nombre, ...u.data.buscar].join(' '),
      texto: u.data.descripcion,
    });
  }

  for (const r of d.recetas) {
    const x = r.data;
    docs.push({
      id: `receta:${r.id}`,
      tipo: 'receta',
      titulo: x.nombre,
      detalle: x.bajada ?? plano(x.recomendadoPara[0]?.texto ?? ''),
      url: `/recetas/${r.id}/`,
      claves: x.nombre,
      texto: plano(
        [
          ...x.recomendadoPara.map((i) => i.texto),
          ...x.ingredientes,
          ...x.notas.map((n) => n.texto),
          ...x.plantas.map((p) => d.plantas.find((y) => y.id === p)!.data.nombre),
        ].join(' '),
      ),
    });
  }

  for (const pr of d.preparaciones) {
    docs.push({
      id: `preparacion:${pr.id}`,
      tipo: 'preparacion',
      titulo: pr.data.nombre,
      detalle: pr.data.bajada,
      url: `/preparaciones/${pr.id}/`,
      claves: pr.data.nombre,
      texto: plano(pr.data.secciones.flatMap((s) => [s.titulo, ...s.items.map((i) => i.texto)]).join(' ')),
    });
  }

  for (const t of d.temas) {
    const url = TEMAS_APARTE.includes(t.id) ? `/${t.id}/` : `/aprender/${t.id}/`;
    docs.push({
      id: `tema:${t.id}`,
      tipo: 'tema',
      titulo: t.data.titulo,
      detalle: t.data.bajada,
      url,
      claves: t.data.titulo,
      texto: recortar(plano((t.body ?? '').replace(/<[^>]+>/g, ' ').replace(/\[\[fuente:[^\]]*\]\]/g, ' ').replace(/[#|>-]/g, ' '))),
    });
  }
  docs.push({
    id: 'tema:como-actuan',
    tipo: 'tema',
    titulo: 'Cómo actúan las plantas digestivas',
    detalle: 'Colagogas, antiespasmódicas, carminativas, amargas, antiinflamatorias y antieméticas.',
    url: '/aprender/como-actuan/',
    claves: 'categorias de accion colagogas coleréticas antiespasmódicas carminativas amargas antiinflamatorias antieméticas',
    texto: plano(d.categorias.map((c) => `${c.data.nombre} ${c.data.resumen} ${c.data.mecanismo}`).join(' ')),
  });

  for (const g of d.glosario) {
    docs.push({
      id: `glosario:${g.id}`,
      tipo: 'glosario',
      titulo: g.data.termino,
      detalle: plano(g.data.definicion).slice(0, 140) + (g.data.definicion.length > 140 ? '…' : ''),
      url: `/glosario/#${g.id}`,
      claves: g.data.termino,
      texto: plano(g.data.definicion),
    });
  }

  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
