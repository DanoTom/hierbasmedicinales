/**
 * Datos generales del sitio. Para personalizarlo alcanza con cambiar esto.
 */
export const SITIO = {
  /** Nombre de la dueña del cuaderno. Si se completa, el título pasa a ser «La Botica de …». */
  duena: '',
  titulo: 'La Botica',
  subtitulo: 'Cuaderno de plantas medicinales',
  descripcion:
    'Todo lo aprendido en los talleres de plantas medicinales, hongos y preparaciones, ordenado para consultar desde el celular.',
  /** Quién dio los talleres (se acredita en el pie y en «El taller»). */
  docente: 'Ayelén Florencia Crespi',
  espacio: 'Mburucuyá hierbas',
  instagram: 'mburucuya.hierbas',
};

export const tituloSitio = SITIO.duena ? `${SITIO.titulo} de ${SITIO.duena}` : SITIO.titulo;
