/**
 * Revisa que no haya enlaces rotos dentro del sitio ya compilado (dist/):
 * cada href y src interno tiene que apuntar a un archivo que exista, y cada
 * #ancla a un id de la página de destino.
 *
 *   npm run build && npm run links
 */
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');

async function listar(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await listar(ruta)));
    else if (e.name.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

const existe = (f) => access(f).then(() => true, () => false);
const paginas = await listar(DIST);
const ids = new Map();
const htmls = new Map();
for (const p of paginas) {
  const html = await readFile(p, 'utf8');
  htmls.set(p, html);
  ids.set(p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

let rotos = 0;
let revisados = 0;
for (const [pagina, html] of htmls) {
  const desde = '/' + path.relative(DIST, pagina).replace(/index\.html$/, '');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"|\ssrcset="([^"]+)"/g)) {
    const valores = m[1] ? [m[1]] : m[2].split(',').map((s) => s.trim().split(/\s+/)[0]);
    for (const v of valores) {
      if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(v)) continue;
      revisados++;
      const url = new URL(v, 'http://sitio' + desde);
      let destino = path.join(DIST, decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) destino = path.join(destino, 'index.html');
      if (!(await existe(destino))) {
        console.log(`✗ ${desde} → ${v} (no existe)`);
        rotos++;
        continue;
      }
      if (url.hash && destino.endsWith('.html')) {
        const ancla = decodeURIComponent(url.hash.slice(1));
        if (!ids.get(destino)?.has(ancla)) {
          console.log(`✗ ${desde} → ${v} (no existe el ancla #${ancla})`);
          rotos++;
        }
      }
    }
  }
}
console.log(`${paginas.length} páginas, ${revisados} enlaces internos revisados, ${rotos} rotos.`);
process.exit(rotos ? 1 : 0);
