/**
 * Datos generales del sitio. Para personalizarlo alcanza con cambiar esto.
 */
export const SITIO = {
  /** Nombre de la dueña del cuaderno. Si se completa, el título pasa a ser «La Botica de …». */
  duena: '',
  titulo: 'La Botica',
  subtitulo: 'Plantas medicinales y hongos',
  descripcion:
    'Plantas medicinales y hongos: para qué sirve cada uno, cómo se prepara y qué cuidados tener. Con recetas paso a paso, para consultar desde el celular.',
  /** Quién dio los talleres (se acredita en el pie y en «De dónde sale»). */
  docente: 'Ayelén Florencia Crespi',
  espacio: 'Mburucuyá hierbas',
  instagram: 'mburucuya.hierbas',
};

export const tituloSitio = SITIO.duena ? `${SITIO.titulo} de ${SITIO.duena}` : SITIO.titulo;
