/**
 * Genera las versiones optimizadas (WebP en varios tamaños) de las láminas
 * botánicas y de las imágenes de los temas.
 *
 *   node scripts/laminas/procesar.mjs
 *
 * Entrada:  assets/laminas/originales/<id>.jpg|png   (una por lámina)
 *           assets/imagenes/<nombre>.png|jpg
 * Salida:   public/laminas/<id>-<ancho>.webp
 *           public/imagenes/<nombre>.webp
 *
 * Además actualiza ancho, alto y tamaños de cada lámina en src/data/laminas.yaml.
 */
import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import * as yaml from 'js-yaml';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const ORIGENES = path.join(RAIZ, 'assets/laminas/originales');
const DESTINO = path.join(RAIZ, 'public/laminas');
const IMAGENES_ORIGEN = path.join(RAIZ, 'assets/imagenes');
const IMAGENES_DESTINO = path.join(RAIZ, 'public/imagenes');
const DATOS = path.join(RAIZ, 'src/data/laminas.yaml');

/** Anchos que se generan (nunca más grandes que el original). */
const ANCHOS = [320, 480, 720, 1080];

async function procesarLaminas() {
  await mkdir(DESTINO, { recursive: true });
  const datos = yaml.load(await readFile(DATOS, 'utf8')) ?? [];
  const archivos = (await readdir(ORIGENES)).filter((a) => /\.(jpe?g|png|webp|tiff?)$/i.test(a));
  for (const archivo of archivos) {
    const id = path.parse(archivo).name;
    const imagen = sharp(path.join(ORIGENES, archivo));
    const { width, height } = await imagen.metadata();
    const anchos = ANCHOS.filter((a) => a < width);
    anchos.push(Math.min(width, ANCHOS.at(-1)));
    const tamanos = [...new Set(anchos)].sort((a, b) => a - b);
    for (const ancho of tamanos) {
      await sharp(path.join(ORIGENES, archivo))
        .resize({ width: ancho })
        .webp({ quality: 78, effort: 6 })
        .toFile(path.join(DESTINO, `${id}-${ancho}.webp`));
    }
    const entrada = datos.find((d) => d.id === id);
    if (entrada) {
      entrada.ancho = width;
      entrada.alto = height;
      entrada.tamanos = tamanos;
    } else {
      console.warn(`⚠ ${id}: no hay entrada en src/data/laminas.yaml (agregala con autor, obra y licencia)`);
    }
    console.log(`✓ ${id}: ${width}×${height} → ${tamanos.join(', ')}`);
  }
  await writeFile(DATOS, cabecera + yaml.dump(datos, { lineWidth: 120, quotingType: '"' }));
}

async function procesarImagenes() {
  await mkdir(IMAGENES_DESTINO, { recursive: true });
  for (const archivo of await readdir(IMAGENES_ORIGEN)) {
    const nombre = path.parse(archivo).name;
    await sharp(path.join(IMAGENES_ORIGEN, archivo))
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(IMAGENES_DESTINO, `${nombre}.webp`));
    console.log(`✓ imagen ${nombre}`);
  }
}

const cabecera = `# Láminas botánicas: de dónde sale cada una y con qué licencia.
# Solo imágenes de dominio público verificadas. La página /creditos/ se arma
# con este archivo. ancho, alto y tamanos los completa scripts/laminas/procesar.mjs.
`;

await procesarLaminas();
await procesarImagenes();
