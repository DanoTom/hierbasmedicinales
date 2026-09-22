# Reglas del proyecto (para Claude)

Sitio estático (Astro 7) con el material de los talleres de plantas medicinales
de Mburucuyá hierbas. Lo usa una persona que no es experta en tecnología, sobre
todo desde el celular. Todo en español rioplatense (voseo).

## Contenido: la regla más importante

- **La fuente de verdad son los documentos de `/fuentes`.** Leelos (o sus
  transcripciones en `/fuentes/texto/`) antes de tocar una ficha. No inventes
  usos, dosis, preparaciones ni propiedades. Si un dato no está, no está: la
  ficha queda incompleta y se anota en `INFORME_CONTENIDO.md`.
- **Cada dato lleva su fuente**: `de: documento/página` (página del PDF según el
  visor, o número de diapositiva). Los ids de documento están en
  `src/lib/vocabulario.ts` (`DOCUMENTOS`). Si se suma un documento nuevo: copiarlo
  a `/fuentes`, agregarlo a `DOCUMENTOS` (con su total de páginas), a
  `src/lib/rehype-fuentes.mjs` y a `scripts/transcribir-fuentes.py`.
- **Copiá el texto tal cual** (voz y palabras del taller). Solo se permiten
  ajustes mínimos para que una cita se entienda fuera del documento; anotarlos en
  el informe.
- Lo que no sale del material (familia botánica, nombre científico faltante,
  definición general) va con `agregado: true` y hay que verificarlo.
- Si los documentos no coinciden, mostrá las dos versiones con su fuente y
  explicá la diferencia en `diferencias:` de la ficha y en el informe.
- Las **precauciones** van siempre en `contraindicaciones`, `efectosAdversos`,
  `interacciones`, `cuidados` o en un recuadro con `precaucion: true`: el sitio
  las muestra arriba, destacadas. Las `alertas` son un resumen y cada una tiene
  que estar respaldada por ese texto.
- Correcciones que vienen de la persona usuaria (y no de un documento): anotarlas
  en `INFORME_CONTENIDO.md` con fecha y origen.

## Dónde está cada cosa

- Fichas: `src/content/plantas/<planta>.yaml` (modelo en `PLAN.md` §4 y esquema en
  `src/content.config.ts`). Ejemplos completos: `boldo.yaml` (guía digestiva),
  `lavanda.yaml` (varias fuentes y diferencias), `reishi.yaml` (guía de inmunidad),
  `tilo.yaml` (ficha breve).
- Recetas `src/content/recetas/`, preparaciones `src/content/preparaciones/`,
  temas `src/content/temas/*.md` (con `[[fuente: doc/pág]]` al final de cada
  sección), índice por uso `src/data/usos.yaml`, glosario `src/data/glosario.yaml`.
- Láminas: solo **dominio público verificado** y de la especie correcta. Registro
  en `src/data/laminas.yaml`; originales en `assets/laminas/originales/`; WebP con
  `npm run laminas:procesar`; descarga desde Commons con `npm run laminas`.
- Nombre del sitio y de la dueña: `src/config.ts`.

## Antes de dar algo por terminado

1. `npm run verificar` (build + enlaces rotos): tiene que pasar sin errores.
2. `npm run fidelidad` y revisar a mano lo que marque en lo que tocaste.
3. Si cambiaste diseño: `npx astro preview --port 4321 &` y `npm run capturas`;
   mirá las capturas de celular (390 px) y escritorio.
4. Actualizar `INFORME_CONTENIDO.md` si cambió el contenido.

## Diseño

Sistema de diseño en `PLAN.md` §5 y `src/styles/tokens.css`. Texto de cuerpo
≥ 18 px, contraste AA, áreas táctiles ≥ 44 px (se usan 48), navegación siempre
visible, nada escondido detrás de gestos.
