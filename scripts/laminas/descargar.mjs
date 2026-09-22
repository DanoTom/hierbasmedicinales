/**
 * Descarga láminas botánicas de dominio público desde Wikimedia Commons para
 * las fichas que todavía no tienen, las optimiza y actualiza los créditos.
 *
 *   npm run laminas              → descarga y procesa
 *   npm run laminas -- --revisar → solo muestra qué haría (no descarga nada)
 *
 * Necesita acceso a commons.wikimedia.org y upload.wikimedia.org.
 *
 * Qué verifica antes de usar una imagen:
 *  1. Que el título del archivo empiece con el nombre científico de la ficha
 *     (o un sinónimo listado en manifiesto.yaml): así no entra una especie
 *     equivocada.
 *  2. Que la licencia declarada en Commons sea dominio público o CC0.
 * Después de correrlo, mirá /creditos/ y cada ficha nueva: si una lámina no
 * corresponde, borrá la línea «lamina:» de esa ficha y su entrada en
 * src/data/laminas.yaml.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import * as yaml from 'js-yaml';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const API = 'https://commons.wikimedia.org/w/api.php';
const AGENTE = 'LaBotica/1.0 (cuaderno personal de plantas medicinales; https://github.com/DanoTom/hierbasmedicinales)';
const CATEGORIAS_KOHLER = ["Category:Köhler's Medizinal-Pflanzen", 'Category:Köhlers Medizinal-Pflanzen'];
const SOLO_REVISAR = process.argv.includes('--revisar');

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(parametros) {
  const url = new URL(API);
  url.search = new URLSearchParams({ format: 'json', formatversion: '2', ...parametros }).toString();
  for (let intento = 1; ; intento++) {
    const r = await fetch(url, { headers: { 'User-Agent': AGENTE } });
    if (r.ok) return r.json();
    if (intento >= 4) throw new Error(`Commons respondió ${r.status} para ${url}`);
    await esperar(1000 * 2 ** intento);
  }
}

async function archivosDeCategoria(categoria) {
  const titulos = [];
  let seguir;
  do {
    const r = await api({ action: 'query', list: 'categorymembers', cmtitle: categoria, cmtype: 'file', cmlimit: '500', ...(seguir ? { cmcontinue: seguir } : {}) });
    titulos.push(...(r.query?.categorymembers ?? []).map((m) => m.title));
    seguir = r.continue?.cmcontinue;
  } while (seguir);
  return titulos;
}

async function datosDeArchivo(titulo) {
  const r = await api({ action: 'query', titles: titulo, prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' });
  return r.query?.pages?.[0]?.imageinfo?.[0];
}

const sinHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const normalizarNombre = (s) => s.replace(/_/g, ' ').replace(/\s*×\s*/g, ' × ').replace(/\s+/g, ' ').trim().toLowerCase();

function esDominioPublico(meta) {
  const licencia = `${meta?.LicenseShortName?.value ?? ''} ${meta?.License?.value ?? ''}`;
  return /public domain|dominio p[uú]blico|\bpd\b|pd-|cc0/i.test(licencia) && !/cc[- ]by/i.test(licencia);
}

function buscarKohler(titulos, nombres) {
  for (const nombre of nombres) {
    const n = normalizarNombre(nombre);
    const hallado = titulos.find((t) => {
      const m = /^File:(.+?) - Köhler–s Medizinal-Pflanzen-(\d+)\.jpg$/i.exec(t);
      return m && normalizarNombre(m[1]) === n;
    });
    if (hallado) return { titulo: hallado, especie: nombre };
  }
  return undefined;
}

async function main() {
  const manifiesto = yaml.load(await readFile(path.join(RAIZ, 'scripts/laminas/manifiesto.yaml'), 'utf8'));
  const rutaLaminas = path.join(RAIZ, 'src/data/laminas.yaml');
  const laminas = yaml.load(await readFile(rutaLaminas, 'utf8')) ?? [];

  console.log('Leyendo la lista de láminas de Köhler en Commons…');
  const kohler = [...new Set((await Promise.all(CATEGORIAS_KOHLER.map(archivosDeCategoria))).flat())];
  console.log(`  ${kohler.length} archivos en las categorías de Köhler.\n`);

  const resumen = { nuevas: [], yaTenian: [], sinLamina: [] };
  for (const entrada of manifiesto) {
    const rutaFicha = path.join(RAIZ, 'src/content/plantas', `${entrada.planta}.yaml`);
    const ficha = await readFile(rutaFicha, 'utf8');
    if (/^lamina:/m.test(ficha)) {
      resumen.yaTenian.push(entrada.planta);
      continue;
    }

    let candidato = entrada.archivo ? { titulo: entrada.archivo, especie: entrada.buscar[0] } : buscarKohler(kohler, entrada.buscar);
    if (candidato && entrada.archivo) {
      const titulo = normalizarNombre(candidato.titulo.replace(/^File:/, ''));
      if (!entrada.buscar.some((n) => titulo.includes(normalizarNombre(n)))) {
        console.log(`✗ ${entrada.planta}: «${candidato.titulo}» no menciona ${entrada.buscar.join(' / ')} en el título. Se omite.`);
        candidato = undefined;
      }
    }
    if (!candidato) {
      const sugerencias = [];
      for (const nombre of entrada.buscar) {
        const cat = `Category:${nombre} - botanical illustrations`;
        sugerencias.push(...(await archivosDeCategoria(cat)).slice(0, 6));
      }
      resumen.sinLamina.push({ planta: entrada.planta, sugerencias });
      continue;
    }

    const info = await datosDeArchivo(candidato.titulo);
    if (!info) {
      console.log(`✗ ${entrada.planta}: no se pudo leer ${candidato.titulo}`);
      continue;
    }
    if (!esDominioPublico(info.extmetadata)) {
      console.log(`✗ ${entrada.planta}: ${candidato.titulo} no figura como dominio público (${info.extmetadata?.LicenseShortName?.value}). Se omite.`);
      continue;
    }
    const lamina = /Köhler–s Medizinal-Pflanzen-(\d+)/.exec(candidato.titulo)?.[1];
    console.log(`✓ ${entrada.planta}: ${candidato.titulo}`);
    if (SOLO_REVISAR) {
      resumen.nuevas.push(entrada.planta);
      continue;
    }

    const imagen = await fetch(info.thumburl ?? info.url, { headers: { 'User-Agent': AGENTE } });
    if (!imagen.ok) {
      console.log(`  ✗ no se pudo descargar (${imagen.status})`);
      continue;
    }
    await mkdir(path.join(RAIZ, 'assets/laminas/originales'), { recursive: true });
    await writeFile(path.join(RAIZ, 'assets/laminas/originales', `${entrada.planta}.jpg`), Buffer.from(await imagen.arrayBuffer()));

    const meta = info.extmetadata ?? {};
    const registro = {
      id: entrada.planta,
      especie: candidato.especie,
      titulo: candidato.titulo.replace(/^File:/, ''),
      autor: sinHtml(meta.Artist?.value) || (lamina ? 'Ilustradores de la obra de Franz Eugen Köhler' : 'Desconocido'),
      obra: lamina ? `Köhler's Medizinal-Pflanzen, lámina ${Number(lamina)}` : sinHtml(meta.ObjectName?.value) || candidato.titulo,
      anio: lamina ? '1887' : sinHtml(meta.DateTimeOriginal?.value) || 's. f.',
      licencia: `Dominio público (${sinHtml(meta.LicenseShortName?.value) || 'según Wikimedia Commons'})`,
      origen: 'Wikimedia Commons.',
      url: info.descriptionurl,
      ancho: 0,
      alto: 0,
      tamanos: [1],
    };
    const i = laminas.findIndex((l) => l.id === entrada.planta);
    if (i >= 0) laminas[i] = registro;
    else laminas.push(registro);
    await writeFile(rutaFicha, ficha.replace(/\s*$/, '\n') + `lamina: ${entrada.planta}\n`);
    resumen.nuevas.push(entrada.planta);
    await esperar(400);
  }

  if (!SOLO_REVISAR && resumen.nuevas.length) {
    await writeFile(rutaLaminas, yaml.dump(laminas, { lineWidth: 120, quotingType: '"' }));
    execFileSync('node', [path.join(RAIZ, 'scripts/laminas/procesar.mjs')], { stdio: 'inherit' });
  }

  console.log(`\n${SOLO_REVISAR ? 'Se agregarían' : 'Nuevas'}: ${resumen.nuevas.length} · Ya tenían lámina: ${resumen.yaTenian.length} · Sin lámina automática: ${resumen.sinLamina.length}`);
  for (const s of resumen.sinLamina) {
    console.log(`\n· ${s.planta}: no hay lámina de Köhler. Candidatas para revisar a mano (verificar especie y licencia):`);
    if (!s.sugerencias.length) console.log('    (ninguna en las categorías de ilustraciones botánicas)');
    for (const t of s.sugerencias) console.log(`    https://commons.wikimedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`);
  }
  if (!SOLO_REVISAR && resumen.nuevas.length) {
    console.log('\nListo. Revisá /creditos/ y las fichas nuevas antes de publicar.');
  }
}

main().catch((e) => {
  console.error('\nNo se pudo completar:', e.message);
  console.error('¿Hay acceso a commons.wikimedia.org y upload.wikimedia.org desde esta máquina?');
  process.exit(1);
});
