# La Botica · Plantas medicinales y hongos

Un sitio web, pensado sobre todo para el celular, que reúne en un solo lugar todo
lo aprendido en los talleres de plantas medicinales de **Mburucuyá hierbas**
(Ayelén Florencia Crespi): las plantas y los hongos, cómo se preparan, las
recetas, las precauciones y los temas que se vieron.

- **Fichas** de 37 plantas y hongos, cada una con para qué se usa, cómo se usa,
  cómo actúa y, bien a la vista, sus **precauciones**.
- **Buscador** que entiende aunque escribas sin tildes o con algún error
  («cedron», «manzaníla»).
- **Buscar por lo que te pasa**: digestión, gases, sueño, estrés, tos, resfrío…
- **Recetas** paso a paso, **preparaciones** (infusión, decocción, tintura…),
  **temas del taller**, **glosario** y una página de **seguridad**.
- **Guardadas**: tocás «Guardar» en una ficha o receta y queda en tu lista.
- **Funciona sin internet** una vez que lo abriste, y se puede **instalar en el
  celular** como una app.
- Cada ficha se puede **imprimir** limpia, en blanco y negro.

Todo sale de los documentos del taller (carpeta [`fuentes`](fuentes/)), y cada
dato dice de qué documento y de qué página salió. Nada se inventó. Lo poco que se
agregó (por ejemplo la familia botánica) está marcado como «agregado».

> Es información para aprender y consultar: **no reemplaza la consulta médica**.
> Con especial cuidado en embarazo, lactancia, niñas y niños, y si se toman
> medicamentos.

---

## Cómo verlo

Una vez publicado (ver más abajo), el sitio tiene una dirección del estilo
`https://la-botica.pages.dev`. Se abre con cualquier navegador.

### Instalarlo en el celular

- **Android (Chrome):** abrí la dirección, tocá el menú **⋮** (arriba a la
  derecha) y elegí **«Instalar app»** o **«Agregar a la pantalla principal»**.
- **iPhone (Safari):** abrí la dirección, tocá el botón **Compartir** (el
  cuadrado con la flecha) y elegí **«Agregar a inicio»**.

Aparece un ícono verde con un frasco de botica. Desde ahí se abre como una app y
funciona aunque no haya señal.

### Guardadas

Las plantas y recetas guardadas quedan **en ese celular o computadora**. Si se
cambia de teléfono o se borran los datos del navegador, la lista empieza de nuevo.

---

## Cómo publicarlo en internet (Cloudflare Pages)

Esto se hace **una sola vez**. Después, cada cambio que se guarde en GitHub se
publica solo en uno o dos minutos. Es gratis.

1. Entrá a <https://dash.cloudflare.com/sign-up> y creá una cuenta (o iniciá
   sesión).
2. En el menú de la izquierda elegí **Workers & Pages** (o **Compute → Workers &
   Pages**) y tocá **Create** (Crear).
3. Elegí la pestaña **Pages** y luego **Import an existing Git repository**
   (Importar un repositorio de Git) / **Connect to Git**.
4. Conectá tu cuenta de **GitHub** y elegí el repositorio
   **`DanoTom/hierbasmedicinales`**.
5. Completá así:
   - **Project name:** `la-botica` (la dirección va a ser
     `https://la-botica.pages.dev`; si ponés otro nombre, mirá el punto 7).
   - **Production branch:** la rama donde está el sitio. Hoy es
     **`claude/exciting-thompson-gaio87`**. Si antes la unís a `main` (con un
     pull request en GitHub), elegí `main`.
   - **Framework preset:** `Astro`.
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Tocá **Save and Deploy** (Guardar y publicar). En 2 o 3 minutos aparece la
   dirección del sitio.
7. *(Solo si el proyecto no se llama `la-botica`)*: en **Settings → Variables and
   Secrets** agregá una variable `SITIO_URL` con la dirección real (por ejemplo
   `https://mi-botica.pages.dev`) y volvé a publicar.

La versión de Node la toma sola del archivo `.node-version` (Node 22).

**Si Cloudflare no muestra la pestaña «Pages»** y solo ofrece crear un *Worker*
importando el repositorio, también sirve: elegí el mismo repositorio y la misma
rama, con **Build command** `npm run build` y **Deploy command**
`npx wrangler deploy`. La configuración está en `wrangler.jsonc` y la dirección
queda del estilo `https://la-botica.<tu-cuenta>.workers.dev`.

### ¿Público o privado?

El sitio le pide a Google y a los demás buscadores que **no lo indexen**: es un
cuaderno personal con el material de otra persona (la docente del taller). Igual,
cualquiera que tenga la dirección puede abrirlo. Si se quiere que **solo algunas
personas** puedan entrar, Cloudflare tiene **Access** (parte de *Zero Trust*,
gratis hasta 50 personas): pide un código por mail antes de abrir el sitio. Se
configura en **Zero Trust → Access → Applications**, con la dirección del sitio y
la lista de mails permitidos.

---

## Cómo pedirle a Claude que agregue o corrija algo

No hace falta saber programar. Abrí una sesión de Claude Code con este
repositorio y pedíselo con tus palabras. Claude lee el archivo `CLAUDE.md`, que
tiene las reglas del proyecto (por ejemplo, que no se inventa nada y que cada
dato lleva su fuente).

Ejemplos de pedidos:

- **Agregar un documento nuevo del taller:**
  > «Te adjunto la guía del nuevo taller de plantas para la piel. Guardala en
  > /fuentes y agregá las fichas nuevas al sitio, con la fuente de cada dato.
  > Si alguna planta ya existe, sumá lo nuevo a su ficha.»
- **Corregir una ficha:**
  > «En la ficha de la melisa, la presentación dice 10 g por litro, pero en el
  > taller dijeron 15 g. Corregilo y anotá que la corrección viene de lo que dijo
  > la docente en clase.»
- **Agregar una planta que no está:**
  > «Agregá el llantén con la información de esta foto de mis apuntes.»
- **Resolver algo del informe:**
  > «Del INFORME_CONTENIDO, punto 8.2: la docente dice que para 100 g de hierba
  > van [tal cantidad] de líquido. Agregalo a la receta de tintura madre.»
- **Poner el nombre de mi mamá en el sitio:**
  > «Que el sitio se llame “La Botica de Marta”.»
- **Cambiar o sumar una lámina:**
  > «La lámina del tulsi: buscá una de dominio público, revisala contra el nombre
  > científico y agregala.»
  (Necesita una sesión con acceso a Wikimedia Commons; ver abajo.)

Cuando Claude termina, guarda los cambios en GitHub y Cloudflare publica la
versión nueva sola.

---

## Láminas botánicas

Las ilustraciones son láminas antiguas de **dominio público**: 21 de *Köhler's
Medizinal-Pflanzen* (1887) y 14 de otras obras (Blackwell, *Flora Graeca*,
Thomé, Redouté, Sowerby, Bulliard, *Flora Danica*, *Flora Batava*…). Cada una
se revisó mirándola y comparándola con el nombre científico de su ficha. De
dónde sale cada una está en la página Créditos del sitio.

Sin lámina quedan el **astrágalo** y el **tulsi** (no se encontró una de
dominio público con la especie segura); muestran un ornamento de etiqueta de
botica.

Para sumar o cambiar láminas:

1. Hace falta una sesión de Claude Code con acceso a
   `commons.wikimedia.org` y `upload.wikimedia.org` (en Claude Code en la web:
   configuración del entorno → acceso a la red).
2. `npm run laminas` baja las láminas de Köhler que existan para cada especie
   de `scripts/laminas/manifiesto.yaml`, verifica que sean de dominio público
   y que el nombre científico coincida, las optimiza y actualiza los créditos.
   Las de otras obras se eligen a mano y se anotan en el manifiesto con
   `archivo:`, la especie que muestran y sus créditos.
3. Commons limita la cantidad de pedidos: si el script dice «Con error», se
   vuelve a correr más tarde y sigue donde quedó.

---

## Para quien programe

- Sitio estático hecho con [Astro](https://astro.build) 7. Sin servidor ni base
  de datos.
- **Contenido** separado del diseño:
  - `src/content/plantas/*.yaml` — una ficha por planta u hongo.
  - `src/content/recetas/*.yaml`, `src/content/preparaciones/*.yaml`.
  - `src/content/temas/*.md` — temas del taller (Markdown).
  - `src/data/` — usos, glosario, categorías de acción y créditos de láminas.
  - El esquema está en `src/content.config.ts` y valida todo al compilar.
- **Diseño:** `src/styles/` (tokens, base, componentes, impresión) y
  `src/components/`. El sistema de diseño está descripto en `PLAN.md`.
- **Comandos:**

  | Comando | Qué hace |
  |---|---|
  | `npm install` | Instala lo necesario (una vez) |
  | `npm run dev` | Sitio de prueba en <http://localhost:4321> |
  | `npm run build` | Genera el sitio en `dist/` (y el service worker) |
  | `npm run verificar` | Build + revisión de enlaces rotos |
  | `npm run fidelidad` | Compara cada dato con la página de la fuente que cita (Python) |
  | `npm run capturas` | Capturas en celular y escritorio (con `npm run preview` andando) |
  | `npm run offline` | Prueba el modo sin conexión (con `npm run preview` andando) |
  | `npm run laminas` | Baja láminas de dominio público de Wikimedia Commons |
  | `npm run iconos` | Regenera los íconos de la app |

- Transcripciones de las fuentes: `python3 scripts/transcribir-fuentes.py`
  (requiere `pip install pymupdf python-pptx`).

## Documentos del proyecto

- [`PLAN.md`](PLAN.md) — plan, decisiones técnicas y sistema de diseño.
- [`INFORME_CONTENIDO.md`](INFORME_CONTENIDO.md) — qué se extrajo, qué no
  coincidía entre documentos y qué falta. **Para revisar.**
- [`CLAUDE.md`](CLAUDE.md) — reglas para editar el contenido.

## Créditos

- Contenido: material de los talleres de Mburucuyá hierbas (Ayelén Florencia
  Crespi).
- Láminas: *Köhler's Medizinal-Pflanzen* (1887) y otras obras antiguas (el
  detalle está en la página Créditos), dominio público, vía Wikimedia Commons.
  Diagrama digestivo: Mariana Ruiz Villarreal, dominio público.
- Tipografías: Fraunces y Figtree (SIL Open Font License).
