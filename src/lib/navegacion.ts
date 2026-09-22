/** Destinos de la navegación. Pocos y siempre visibles. */
export const NAV_CELULAR = [
  { href: '/', texto: 'Inicio', icono: 'inicio' },
  { href: '/plantas/', texto: 'Plantas', icono: 'hoja' },
  { href: '/buscar/', texto: 'Buscar', icono: 'buscar' },
  { href: '/recetas/', texto: 'Recetas', icono: 'taza' },
  { href: '/guardadas/', texto: 'Guardadas', icono: 'guardar' },
] as const;

export const NAV_PRINCIPAL = [
  { href: '/plantas/', texto: 'Plantas', icono: 'hoja' },
  { href: '/usos/', texto: 'Por uso', icono: 'cuenco' },
  { href: '/recetas/', texto: 'Recetas', icono: 'taza' },
  { href: '/preparaciones/', texto: 'Preparaciones', icono: 'frasco' },
  { href: '/aprender/', texto: 'Aprender', icono: 'libro' },
  { href: '/guardadas/', texto: 'Guardadas', icono: 'guardar' },
  { href: '/buscar/', texto: 'Buscar', icono: 'buscar' },
] as const;

export function estaActivo(ruta: string, href: string) {
  if (href === '/') return ruta === '/';
  return ruta.startsWith(href);
}
