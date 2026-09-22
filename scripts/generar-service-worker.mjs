/**
 * Genera dist/sw.js después del build: un service worker que guarda todo el
 * sitio en el dispositivo para que funcione sin conexión.
 *
 * Se ejecuta solo con `npm run build`. La versión cambia cuando cambia
 * cualquier archivo, y así el celular descarga la versión nueva.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const EXCLUIR = new Set(['sw.js', '_headers', '_redirects', 'robots.txt']);

async function listar(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await listar(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

const archivos = (await listar(DIST)).filter((f) => !EXCLUIR.has(path.relative(DIST, f)) && !/LICENSE/.test(f));
const hash = createHash('sha256');
const urls = [];
let bytes = 0;
for (const f of archivos.sort()) {
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  hash.update(rel);
  hash.update(await readFile(f));
  bytes += (await stat(f)).size;
  // /plantas/boldo/index.html → /plantas/boldo/
  urls.push(rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel);
}
const version = hash.digest('hex').slice(0, 12);

const sw = `/* Service worker generado por scripts/generar-service-worker.mjs. No editar a mano. */
const VERSION = '${version}';
const CACHE = 'botica-' + VERSION;
const PRECARGA = ${JSON.stringify(urls)};

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECARGA)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => c.startsWith('botica-') && c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  evento.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      // Páginas: se ignoran los parámetros (?q=, ?uso=) para encontrar la copia guardada.
      const guardada = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (guardada) return guardada;
      try {
        const respuesta = await fetch(request);
        if (respuesta.ok && respuesta.type === 'basic') cache.put(request, respuesta.clone());
        return respuesta;
      } catch (error) {
        if (request.mode === 'navigate') {
          return (await cache.match('/404.html')) || Response.error();
        }
        throw error;
      }
    })(),
  );
});
`;
await writeFile(path.join(DIST, 'sw.js'), sw);
console.log(`✓ sw.js: versión ${version}, ${urls.length} archivos para usar sin conexión (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
