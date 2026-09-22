// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFuentes from './src/lib/rehype-fuentes.mjs';

// Dirección pública del sitio. Cloudflare Pages la informa en CF_PAGES_URL
// durante el build; si no, se usa la dirección de producción esperada.
const site = process.env.SITIO_URL || process.env.CF_PAGES_URL || 'https://la-botica.pages.dev';

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
