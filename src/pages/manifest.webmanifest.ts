/** Manifiesto de la app (para instalarla en el celular). */
import type { APIRoute } from 'astro';
import { SITIO, tituloSitio } from '../config';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: `${tituloSitio} · ${SITIO.subtitulo}`,
        short_name: tituloSitio.length > 12 ? SITIO.titulo : tituloSitio,
        description: SITIO.descripcion,
        lang: 'es-AR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f5eedf',
        theme_color: '#f5eedf',
        categories: ['health', 'education', 'lifestyle'],
        icons: [
          { src: '/iconos/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/iconos/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/iconos/icono-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/iconos/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Buscar', url: '/buscar/', icons: [{ src: '/iconos/icono-192.png', sizes: '192x192' }] },
          { name: 'Plantas', url: '/plantas/', icons: [{ src: '/iconos/icono-192.png', sizes: '192x192' }] },
          { name: 'Guardadas', url: '/guardadas/', icons: [{ src: '/iconos/icono-192.png', sizes: '192x192' }] },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
