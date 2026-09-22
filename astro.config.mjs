// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFuentes from './src/lib/rehype-fuentes.mjs';

// Dirección pública del sitio. Si el proyecto de Cloudflare Pages tiene otro
// nombre, definir la variable SITIO_URL (por ejemplo https://mi-botica.pages.dev).
const site = process.env.SITIO_URL || 'https://la-botica.pages.dev';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  prefetch: false,
  devToolbar: { enabled: false },
  // Markdown de los temas: tablas (GFM) y notas de fuente. Sin «comillas
  // inteligentes», para no tocar el texto original.
  markdown: { processor: unified({ rehypePlugins: [rehypeFuentes], smartypants: false }) },
});
