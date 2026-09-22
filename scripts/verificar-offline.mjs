/**
 * Prueba el modo sin conexión: carga el sitio, espera que el service worker
 * guarde todo, corta la red y navega.
 *
 *   npm run build && npx astro preview --port 4321 &
 *   npm run offline
 */
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.evaluate(() => navigator.serviceWorker.ready);
// esperar a que termine la precarga
await p.waitForFunction(async () => {
  const k = await caches.keys();
  if (!k.length) return false;
  const c = await caches.open(k[0]);
  return (await c.keys()).length >= 120;
}, null, { timeout: 60000 });
const n = await p.evaluate(async () => { const k = await caches.keys(); const c = await caches.open(k[0]); return (await c.keys()).length; });
console.log('Archivos guardados para usar sin conexión:', n);
await ctx.setOffline(true);
for (const ruta of ['/plantas/boldo/', '/recetas/amargo-aperitivo/', '/usos/sueno/', '/glosario/', '/plantas/?uso=gases']) {
  await p.goto('http://localhost:4321' + ruta, { waitUntil: 'load' });
  console.log('sin conexión', ruta, '→', await p.title());
}
await p.goto('http://localhost:4321/buscar/?q=valeriana', { waitUntil: 'load' });
await p.waitForTimeout(1500);
console.log('búsqueda sin conexión:', (await p.locator('.resultado__titulo').allTextContents()).slice(0, 4));
const img = await p.goto('http://localhost:4321/plantas/valeriana/');
await p.waitForTimeout(500);
console.log('lámina cargada sin conexión:', await p.evaluate(() => { const i = document.querySelector('.ficha__lamina img'); return i && i.complete && i.naturalWidth > 0; }));
await b.close();
