/**
 * Genera los íconos de la app (frasco de botica con una hoja).
 *   node scripts/generar-iconos.mjs
 * Salida en public/iconos/.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const VERDE = '#2e5436';
const VERDE_HONDO = '#1e3a25';
const CREMA = '#fbf7ee';
const PAPEL = '#ebe1cb';
const SEPIA = '#7a5634';
const ORO = '#b59350';

/** Frasco centrado en un lienzo de 512. `escala` achica el dibujo (zona segura de los íconos «maskable»). */
function frasco(escala = 1) {
  const t = `translate(256 262) scale(${escala}) translate(-256 -262)`;
  return `<g transform="${t}">
    <rect x="204" y="124" width="104" height="30" rx="7" fill="${ORO}"/>
    <rect x="204" y="124" width="104" height="30" rx="7" fill="none" stroke="${VERDE_HONDO}" stroke-opacity=".25" stroke-width="2"/>
    <rect x="219" y="152" width="74" height="36" fill="${CREMA}"/>
    <path d="M219 186C189 198 158 218 158 254V368Q158 396 186 396H326Q354 396 354 368V254C354 218 323 198 293 186Z" fill="${CREMA}"/>
    <path d="M232 196C210 206 190 222 184 246" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/>
    <rect x="176" y="262" width="160" height="96" rx="5" fill="${PAPEL}"/>
    <rect x="183" y="269" width="146" height="82" rx="3" fill="none" stroke="${SEPIA}" stroke-width="2.5"/>
    <path d="M222 338C223 300 248 282 292 280C290 320 266 337 222 338Z" fill="${VERDE}"/>
    <path d="M222 338L276 294" stroke="${PAPEL}" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

const fondo = (redondeo) => `
  <defs><radialGradient id="g" cx="50%" cy="42%" r="65%"><stop offset="0" stop-color="#3a6843"/><stop offset="1" stop-color="${VERDE}"/></radialGradient></defs>
  <rect width="512" height="512" rx="${redondeo}" fill="url(#g)"/>`;

const svg = (contenido) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${contenido}</svg>`;

const normal = svg(`${fondo(112)}<circle cx="256" cy="256" r="214" fill="none" stroke="${ORO}" stroke-width="5"/>${frasco(1)}`);
const maskable = svg(`${fondo(0)}<circle cx="256" cy="256" r="186" fill="none" stroke="${ORO}" stroke-width="4"/>${frasco(0.8)}`);
const apple = svg(`${fondo(0)}<circle cx="256" cy="256" r="206" fill="none" stroke="${ORO}" stroke-width="5"/>${frasco(0.92)}`);
const favicon = svg(`<circle cx="256" cy="256" r="256" fill="${VERDE}"/>${frasco(1.12)}`);

await mkdir('public/iconos', { recursive: true });
await writeFile('public/iconos/favicon.svg', favicon);
const salidas = [
  [normal, 'icono-192.png', 192],
  [normal, 'icono-512.png', 512],
  [maskable, 'icono-maskable-512.png', 512],
  [maskable, 'icono-maskable-192.png', 192],
  [apple, 'apple-touch-icon.png', 180],
  [favicon, 'icono-32.png', 32],
];
for (const [s, nombre, tam] of salidas) {
  await sharp(Buffer.from(s), { density: 300 }).resize(tam, tam).png({ compressionLevel: 9 }).toFile(`public/iconos/${nombre}`);
  console.log('✓', nombre);
}
