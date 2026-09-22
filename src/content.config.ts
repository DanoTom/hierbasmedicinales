/**
 * Esquema de los datos del sitio. Astro lo usa para validar cada archivo al
 * compilar: si falta un campo obligatorio o una fuente no existe, el build
 * falla y dice en qué archivo está el problema.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  DOCUMENTOS,
  CLAVES_ALERTAS,
  CLAVES_PARTES,
  CLAVES_PREPARACIONES,
  type IdDocumento,
} from './lib/vocabulario';

// ---------------------------------------------------------------------------
// Referencias a las fuentes: «guia-digestiva/5», «taller-estres/6»,
// «guia-inmunidad/12-13» (rango de páginas).
// ---------------------------------------------------------------------------
const PATRON_REF = /^([a-z-]+)\/(\d+)(?:-(\d+))?$/;

const ref = z.string().superRefine((valor, ctx) => {
  const m = PATRON_REF.exec(valor);
  if (!m) {
    ctx.addIssue({ code: 'custom', message: `Fuente mal escrita: «${valor}». Formato: documento/página` });
    return;
  }
  const doc = DOCUMENTOS[m[1] as IdDocumento];
  if (!doc) {
    ctx.addIssue({ code: 'custom', message: `Documento desconocido en «${valor}»` });
    return;
  }
  const desde = Number(m[2]);
  const hasta = m[3] ? Number(m[3]) : desde;
  if (desde < 1 || hasta > doc.total || hasta < desde) {
    ctx.addIssue({ code: 'custom', message: `Página/diapositiva fuera de rango en «${valor}» (el documento tiene ${doc.total})` });
  }
});

/** Una o varias fuentes; siempre se normaliza a lista. */
const refs = z.union([ref, z.array(ref).min(1)]).transform((v) => (Array.isArray(v) ? v : [v]));

/** Un dato con su fuente. `texto` admite párrafos (línea en blanco) y *cursiva* / **negrita**. */
const dato = z.object({ texto: z.string().min(1), de: refs });

/** Un dato que puede ser un agregado (no está en el material del taller). */
const datoOAgregado = z
  .object({
    nombre: z.string().min(1),
    de: refs.optional(),
    agregado: z.boolean().optional(),
    nota: z.string().optional(),
  })
  .refine((x) => x.de || x.agregado, { message: 'Hace falta «de» (fuente) o «agregado: true»' });

// ---------------------------------------------------------------------------
// Plantas y hongos
// ---------------------------------------------------------------------------
const plantas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/plantas' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['planta', 'hongo']),
    /** true = el taller solo la menciona (ficha breve). */
    breve: z.boolean().default(false),
    otrosNombres: z.array(datoOAgregado).default([]),
    cientifico: z.array(datoOAgregado).min(1),
    familia: datoOAgregado.optional(),
    compuestoActivo: dato.optional(),
    acciones: z.object({ lista: z.array(z.string()).min(1), de: refs }).optional(),
    partes: z
      .array(
        z
          .object({
            parte: z.enum(CLAVES_PARTES),
            detalle: z.string().optional(),
            de: refs.optional(),
            agregado: z.boolean().optional(),
          })
          .refine((x) => x.de || x.agregado, { message: 'Hace falta «de» o «agregado: true»' }),
      )
      .default([]),
    usos: z.array(dato).default([]),
    alertas: z.array(z.enum(CLAVES_ALERTAS)).default([]),
    contraindicaciones: z.array(dato).default([]),
    efectosAdversos: z.array(dato).default([]),
    interacciones: z.array(dato).default([]),
    /** Tablas «Cuándo tener cuidado» / «A tener en cuenta». */
    cuidados: z.array(z.object({ situacion: z.string(), texto: z.string(), de: refs })).default([]),
    formaDeUso: z.array(dato).default([]),
    comoActua: z.array(dato).default([]),
    evidencia: z.array(dato).default([]),
    /** Recuadros del material. Con `precaucion: true` se muestran dentro del panel de precauciones. */
    recuadros: z
      .array(z.object({ titulo: z.string(), texto: z.string(), de: refs, precaucion: z.boolean().default(false) }))
      .default([]),
    /** Nota de edición cuando los documentos no coinciden entre sí. */
    diferencias: z.array(z.string()).default([]),
    indice: z.object({
      usos: z.array(z.string()).min(1),
      preparaciones: z.array(z.enum(CLAVES_PREPARACIONES)).default([]),
    }),
    /** Id de la lámina en src/data/laminas.yaml. Vacío = ilustración ornamental. */
    lamina: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Recetas
// ---------------------------------------------------------------------------
const recetas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/recetas' }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    bajada: z.string().optional(),
    de: refs,
    tema: z.enum(['digestivo', 'estres', 'inmunidad']),
    plantas: z.array(z.string()).default([]),
    usos: z.array(z.string()).default([]),
    preparacion: z.enum(CLAVES_PREPARACIONES).optional(),
    recomendadoPara: z.array(dato).default([]),
    ingredientes: z.array(z.string()).default([]),
    pasos: z.array(z.object({ titulo: z.string().optional(), texto: z.string() })).default([]),
    formaDeUso: z.array(dato).default([]),
    conservacion: z.array(dato).default([]),
    porQue: z.array(dato).default([]),
    precauciones: z.array(dato).default([]),
    notas: z.array(dato).default([]),
    tablas: z
      .array(
        z.object({
          titulo: z.string(),
          columnas: z.array(z.string()),
          filas: z.array(z.array(z.string())),
          de: refs,
        }),
      )
      .default([]),
  }),
});

// ---------------------------------------------------------------------------
// Preparaciones (infusión, decocción, tintura…)
// ---------------------------------------------------------------------------
const preparaciones = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/preparaciones' }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    clave: z.enum(CLAVES_PREPARACIONES),
    bajada: z.string(),
    secciones: z.array(
      z.object({
        titulo: z.string(),
        items: z.array(dato).default([]),
        tabla: z
          .object({ columnas: z.array(z.string()), filas: z.array(z.array(z.string())), de: refs })
          .optional(),
      }),
    ),
    recetas: z.array(z.string()).default([]),
  }),
});

// ---------------------------------------------------------------------------
// Temas del taller (texto largo en Markdown)
// ---------------------------------------------------------------------------
const temas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/temas' }),
  schema: z.object({
    titulo: z.string(),
    bajada: z.string(),
    orden: z.number(),
    taller: z.enum(['digestivo', 'estres', 'inmunidad', 'general']),
    de: refs,
    plantas: z.array(z.string()).default([]),
  }),
});

// ---------------------------------------------------------------------------
// Datos sueltos (un archivo cada uno)
// ---------------------------------------------------------------------------
const usos = defineCollection({
  loader: file('src/data/usos.yaml'),
  schema: z.object({
    nombre: z.string(),
    grupo: z.enum(['digestion', 'nervios', 'defensas', 'energia']),
    descripcion: z.string(),
    /** Palabras que la gente puede escribir en el buscador para llegar a este uso. */
    buscar: z.array(z.string()).default([]),
    orden: z.number(),
  }),
});

const glosario = defineCollection({
  loader: file('src/data/glosario.yaml'),
  schema: z
    .object({
      termino: z.string(),
      pregunta: z.string().optional(),
      definicion: z.string(),
      ejemplo: z.string().optional(),
      de: refs.optional(),
      agregado: z.boolean().optional(),
      ver: z.string().optional(),
    })
    .refine((x) => x.de || x.agregado, { message: 'Hace falta «de» o «agregado: true»' }),
});

const categorias = defineCollection({
  loader: file('src/data/categorias.yaml'),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    resumen: z.string(),
    subtitulo: z.string(),
    donde: z.string(),
    mecanismo: z.string(),
    advertencia: z.string(),
    de: refs,
    filas: z.array(
      z.object({
        planta: z.string(),
        compuesto: z.string(),
        indicacion: z.string(),
        forma: z.string(),
      }),
    ),
  }),
});

const laminas = defineCollection({
  loader: file('src/data/laminas.yaml'),
  schema: z.object({
    especie: z.string(),
    titulo: z.string(),
    autor: z.string(),
    obra: z.string(),
    anio: z.string(),
    licencia: z.string(),
    origen: z.string(),
    url: z.string().url().optional(),
    ancho: z.number(),
    alto: z.number(),
    tamanos: z.array(z.number()).min(1),
    nota: z.string().optional(),
  }),
});

export const collections = { plantas, recetas, preparaciones, temas, usos, glosario, categorias, laminas };
