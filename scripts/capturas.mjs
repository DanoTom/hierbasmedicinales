/**
 * Capturas del sitio en celular y escritorio, para revisar el diseño.
 *
 *   npm run build && npx astro preview --port 4321 &
 *   node scripts/capturas.mjs [ruta ...]
 *
 * Guarda PNG en capturas/ (móvil 390×844 y escritorio 1366×900).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const rutas = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/plantas/', '/plantas/manzanilla/', '/plantas/lavanda/', '/plantas/reishi/', '/usos/', '/recetas/', '/recetas/infusion-antinauseas/', '/preparaciones/tintura/', '/aprender/', '/aprender/dos-caminos/', '/glosario/', '/buscar/?q=cedron', '/seguridad/'];
const completa = process.env.COMPLETA !== 'no';
const vistas = [
  { nombre: 'movil', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nombre: 'escritorio', viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 },
];

await mkdir('capturas', { recursive: true });
const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM ?? undefined });
for (const v of vistas) {
  const ctx = await navegador.newContext({ ...v, locale: 'es-AR' });
  const pagina = await ctx.newPage();
  for (const ruta of rutas) {
    await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(ruta.includes('?q=') ? 800 : 150);
    const nombre = ruta.replace(/[/?=]+/g, '_').replace(/^_|_$/g, '') || 'inicio';
    await pagina.screenshot({ path: `capturas/${v.nombre}-${nombre}.png`, fullPage: completa });
    console.log(`✓ ${v.nombre} ${ruta}`);
  }
  await ctx.close();
}
await navegador.close();
