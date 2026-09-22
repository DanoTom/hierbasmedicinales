/**
 * Vocabulario controlado que usan las fichas: documentos fuente, partes de la
 * planta, tipos de preparación y alertas. Si se agrega un valor nuevo, va acá.
 */

/** Documentos del taller (carpeta /fuentes). `total` = páginas o diapositivas. */
export const DOCUMENTOS = {
  'guia-digestiva': {
    corto: 'Guía digestiva',
    titulo: 'Guía práctica «Plantas medicinales para el sistema digestivo»',
    archivo: 'guia_plantas_medicinales.pdf',
    unidad: 'pág.',
    unidades: 'págs.',
    total: 14,
  },
  'taller-digestivo': {
    corto: 'Diapositivas del taller digestivo',
    titulo: 'Presentación «Plantas medicinales para el sistema digestivo»',
    archivo: 'taller_plantas_medicinales.pptx',
    unidad: 'diap.',
    unidades: 'diaps.',
    total: 15,
  },
  'taller-estres': {
    corto: 'Taller de estrés y descanso',
    titulo: 'Presentación «Plantas medicinales para el estrés y el descanso»',
    archivo: 'Taller_18-4.pptx',
    unidad: 'diap.',
    unidades: 'diaps.',
    total: 14,
  },
  'guia-inmunidad': {
    corto: 'Guía Inmunidad inteligente',
    titulo: 'Guía de acompañamiento «Inmunidad inteligente»',
    archivo: 'guia-inmunidad-inteligente-2.pdf',
    unidad: 'pág.',
    unidades: 'págs.',
    total: 41,
  },
} as const;

export type IdDocumento = keyof typeof DOCUMENTOS;

export const PARTES = {
  hojas: 'Hojas',
  flores: 'Flores',
  'partes-aereas': 'Partes aéreas',
  raiz: 'Raíz',
  rizoma: 'Rizoma',
  frutos: 'Frutos y semillas',
  gel: 'Gel de la hoja',
  'cuerpo-fructifero': 'Cuerpo fructífero (hongo)',
  micelio: 'Micelio (hongo)',
} as const;

export const PREPARACIONES = {
  infusion: 'Infusión',
  decoccion: 'Decocción',
  tintura: 'Tintura',
  extracto: 'Extracto o cápsulas',
  'aceite-esencial': 'Aceite esencial',
  fresco: 'En la comida',
  jugo: 'Jugo',
  fermentado: 'Fermentado',
  'uso-externo': 'Uso externo',
  polvo: 'Polvo',
} as const;

/**
 * Alertas: un resumen visual de las precauciones. Cada alerta de una ficha
 * tiene que estar respaldada por el texto de sus precauciones.
 */
export const ALERTAS = {
  embarazo: 'Embarazo',
  lactancia: 'Lactancia',
  ninos: 'Niñas y niños',
  anticoagulantes: 'Anticoagulantes',
  presion: 'Presión arterial',
  sedantes: 'Sedantes o ansiolíticos',
  antidepresivos: 'Antidepresivos',
  diabetes: 'Diabetes',
  diureticos: 'Diuréticos',
  autoinmune: 'Enfermedad autoinmune',
  inmunosupresores: 'Inmunosupresores o trasplante',
  tiroides: 'Tiroides',
  higado: 'Hígado',
  'vias-biliares': 'Vesícula y vías biliares',
  'ulcera-gastritis': 'Úlcera o gastritis',
  reflujo: 'Reflujo',
  corazon: 'Corazón',
  rinon: 'Riñón',
  epilepsia: 'Epilepsia',
  alergias: 'Alergias',
  cirugia: 'Cirugía programada',
  medicacion: 'Medicación en general',
  hormonas: 'Patologías hormonodependientes',
  fiebre: 'Infección con fiebre',
  sangrado: 'Riesgo de sangrado',
  hipolipemiantes: 'Medicamentos para el colesterol',
  corticoides: 'Corticoides',
  bipolar: 'Trastorno bipolar',
} as const;

export type Parte = keyof typeof PARTES;
export type Preparacion = keyof typeof PREPARACIONES;
export type Alerta = keyof typeof ALERTAS;

const claves = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
export const CLAVES_PARTES = claves(PARTES);
export const CLAVES_PREPARACIONES = claves(PREPARACIONES);
export const CLAVES_ALERTAS = claves(ALERTAS);
export const CLAVES_DOCUMENTOS = claves(DOCUMENTOS);
