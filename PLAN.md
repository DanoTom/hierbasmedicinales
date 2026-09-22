# Plan de trabajo

Web app para consultar, desde el celular o la PC, todo lo aprendido en los
talleres de plantas medicinales (material en [`/fuentes`](fuentes/)).

## 1. Principios

1. **El material del taller es la fuente de verdad.** Nada de usos, dosis,
   preparaciones ni propiedades que no estén en `/fuentes`. Cada dato guarda de
   qué documento y qué página o diapositiva salió. Lo que agrego yo (familia
   botánica, alguna definición del glosario) queda marcado como *agregado*.
2. **Respetar la voz del taller.** Se copian las frases tal cual (voseo, tono,
   advertencias), no se reescriben en tono de manual.
3. **Seguridad a la vista.** Las precauciones van arriba en cada ficha, en un
   recuadro propio, no al final.
4. **Simple de usar.** Pocos niveles, navegación siempre visible, textos
   grandes, nada escondido detrás de gestos.
5. **Simple de mantener.** Un archivo de datos por planta, separado del diseño.

## 2. Decisiones técnicas

| Tema | Decisión | Por qué |
|---|---|---|
| Generador | **Astro 7** (sitio estático) | Sin servidor ni base de datos. Content collections valida los datos contra un esquema al compilar: si una ficha tiene un error, el build avisa. |
| Datos | Un **YAML por planta/hongo** en `src/content/plantas/`, uno por receta y por preparación; temas del taller en Markdown; glosario, usos y fuentes en `src/data/` | YAML se lee y se edita a mano sin programar. |
| Trazabilidad | Cada dato lleva `de: id-documento/página` | Se muestra en la ficha («Fuente: Guía digestiva, pág. 5») y se valida al compilar que el documento y la página existan. |
| Buscador | **MiniSearch** en el navegador, con índice generado al compilar | Búsqueda difusa (tolera errores de tipeo), por prefijo, e ignora tildes y mayúsculas. Funciona sin conexión. |
| Filtros | Por uso, parte de la planta, preparación y tipo (planta/hongo), con JavaScript mínimo | Sin JavaScript se ven todas las plantas igual. |
| Favoritos | `localStorage` del dispositivo | Sin cuentas ni servidor. |
| Offline / instalable | **PWA** propia: `manifest.webmanifest` + service worker generado después del build con la lista de todos los archivos | Precarga todo el sitio: una vez abierto, funciona sin conexión. |
| Imágenes | `sharp` → WebP en varios tamaños, `srcset`, `loading="lazy"` | Rendimiento en celular. |
| Tipografías | Self-hosted con Fontsource | Sin depender de Google Fonts, y funcionan offline. |
| Deploy | **Cloudflare Pages** conectado al repositorio de GitHub | Gratis, rápido, se actualiza solo con cada cambio. Si no puedo conectarlo yo, dejo instrucciones paso a paso. |
| Verificación | Playwright (capturas móvil y escritorio), chequeo de links propio, Lighthouse | Pedido explícito. |

### Láminas botánicas

El entorno donde trabajo **no tiene acceso a Wikimedia Commons ni a la
Biodiversity Heritage Library** (la red solo permite npm/PyPI). Entonces:

- Uso las tres láminas de *Köhler's Medizinal-Pflanzen* (1887, dominio público)
  que ya vienen en la presentación del taller de estrés: melisa, lavanda y
  valeriana. Verifico especie y autoría.
- Para el resto, un **placeholder ornamental** (etiqueta de botica con el
  nombre) coherente con el estilo. Nunca una imagen dudosa.
- Dejo un **manifiesto** con las láminas de dominio público elegidas para cada
  especie y un **script** (`npm run laminas`) que, desde una máquina con acceso
  a internet, las descarga, verifica la licencia con la API de Commons, las
  optimiza y actualiza la página de créditos.

## 3. Arquitectura de información

Navegación fija abajo en el celular (arriba en la PC), con 5 destinos:
**Inicio · Plantas · Buscar · Recetas · Guardadas**.

```
/                       Inicio: buscador grande, «¿Qué necesitás?» (usos), accesos, aviso
/plantas/               Todas las plantas y hongos + filtros (uso, parte, preparación, tipo)
/plantas/<planta>/      Ficha
/usos/                  Índice por uso (digestión, sueño, tos…)
/usos/<uso>/            Plantas y recetas para ese uso
/recetas/               Recetas del taller
/recetas/<receta>/
/preparaciones/         Infusión, decocción, tintura, extracto, aceite esencial…
/preparaciones/<prep>/
/aprender/              Temas del taller (sistema digestivo, cómo actúan, estrés y
/aprender/<tema>/         descanso, sistema inmune, adaptógenos, hongos, cómo elegir…)
/seguridad/             Precauciones generales, interacciones y señales de alarma
/glosario/
/buscar/                Buscador con resultados agrupados
/guardadas/             Favoritos del dispositivo
/el-taller/             Sobre el material, cartas de la docente, documentos fuente
/creditos/              Láminas: autor, fuente, licencia
```

## 4. Modelo de datos de una ficha

```yaml
nombre: Boldo
tipo: planta            # planta | hongo
breve: false            # true = el taller solo la menciona
otrosNombres: []
cientifico: { nombre: Peumus boldus, de: guia-digestiva/5 }
familia: { nombre: Monimiaceae, agregado: true }
compuestoActivo: { texto: Boldina (alcaloide), de: guia-digestiva/5 }
acciones: { lista: [Colagoga, Colerética], de: guia-digestiva/5 }
partes: [{ parte: hojas, de: guia-digestiva/5 }]
usos: [{ texto: …, de: … }]
alertas: [embarazo, lactancia, anticoagulantes]   # resumen visual, sale del texto
contraindicaciones: [{ texto, de }]
efectosAdversos: [{ texto, de }]
interacciones: [{ texto, de }]
cuidados: [{ situacion, texto, de }]              # tablas «Cuándo tener cuidado»
formaDeUso: [{ texto, de }]
comoActua: [{ texto, de }]
evidencia: [{ texto, de }]
recuadros: [{ titulo, texto, de }]
diferencias: [{ texto }]    # nota de edición cuando los documentos no coinciden
indice: { usos: [digestion, higado], preparaciones: [infusion] }
lamina: boldo               # o vacío → placeholder
```

No hay datos de **cultivo y recolección** en ningún documento: esa sección no
se muestra (queda anotado en el informe).

## 5. Sistema de diseño

Concepto: **boticario clásico con ejecución moderna**. Papel crema, tinta sepia,
verde botánico, etiquetas de frasco con doble filete y esquinas recortadas,
filetes con un ornamento pequeño. Mucho aire, grilla limpia.

### Color (todos los pares de texto cumplen WCAG AA; se verifica con script)

| Token | Valor | Uso |
|---|---|---|
| `--papel` | `#F5EEDF` | Fondo general |
| `--papel-claro` | `#FBF7EE` | Tarjetas, campos |
| `--papel-hondo` | `#EBE1CB` | Etiquetas, bandas, aviso |
| `--tinta` | `#2B2118` | Texto |
| `--tinta-suave` | `#5B4A39` | Texto secundario, fuentes |
| `--verde` | `#2E5436` | Títulos, enlaces, botones |
| `--verde-hondo` | `#1E3A25` | Hover, barra de navegación |
| `--verde-tenue` | `#DCE5D2` | Fondos suaves, chips activos |
| `--sepia` | `#7A5634` | Filetes, ornamentos, números de etiqueta |
| `--oro` | `#B59350` | Solo filetes finos decorativos (nunca texto) |
| `--lacre` | `#8A3520` | Precauciones: títulos y borde |
| `--lacre-tenue` | `#F6E2D6` | Fondo del recuadro de precauciones |

### Tipografía

- **Fraunces** (variable, con eje de tamaño óptico) para títulos: serif con
  carácter, evoca etiquetas antiguas sin ser disfraz.
- **Atkinson Hyperlegible Next** para el cuerpo: diseñada para máxima
  legibilidad (baja visión).
- Cuerpo **18 px mínimo** (19 px en pantallas grandes), interlineado 1,6,
  líneas de hasta ~65 caracteres. Ningún texto por debajo de 16 px.
- Escala 1,25: 16 · 18 · 22,5 · 28 · 35 · 44 · 55 px.

### Espaciado y forma

- Base de 4 px: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- Áreas táctiles de **48 px** (mínimo pedido: 44 px).
- Radios casi nulos (2–4 px): el carácter lo dan los filetes, no las curvas.

### Componentes

`Etiqueta` (rótulo de frasco con doble filete y esquinas recortadas) ·
`Filete` (separador con ornamento) · `TarjetaPlanta` · `PanelPrecauciones` ·
`Aviso` · `Buscador` · `Chip` · `Boton` · `BotonGuardar` · `Fuente` (nota de
procedencia) · `Lamina` (figura con crédito o placeholder) · `NavInferior` ·
`Cabecera` · `Pie`.

## 6. Etapas

1. ~~Copiar documentos a `/fuentes`~~ ✔
2. ~~Transcripciones e inventario~~ ✔
3. Plan y sistema de diseño (este archivo) ✔
4. Proyecto Astro, esquema de datos, tokens y tipografías.
5. Carga de contenido: fichas, recetas, preparaciones, temas, glosario, usos.
   Validación automática de fuentes.
6. Componentes y páginas.
7. Láminas disponibles, placeholders, manifiesto y script de descarga, créditos.
8. PWA (manifest, ícono, service worker), vista de impresión.
9. Verificación: build, links, capturas en móvil y escritorio, Lighthouse.
   Iterar el diseño con ojo crítico.
10. README para no programadores, informe de contenido final, deploy.
