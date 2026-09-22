# Informe de contenido

Este informe es para revisar el contenido del sitio contra el material del taller.
Dice qué se sacó de cada documento, qué estaba ambiguo o no coincidía entre
documentos, y qué falta.

> Estado: **completo**. Última revisión: 22 de septiembre de 2026.

**Resumen para leer rápido:** todo el contenido del sitio sale de los cuatro documentos del taller, con la página o diapositiva de cada dato. Hay **37 fichas** (27 completas y 10 breves), **10 recetas**, **8 preparaciones**, **10 temas**, un **glosario de 56 términos** y un **índice de 23 usos**. En la sección 3 están los puntos donde los documentos no coinciden, y en la 4 lo que falta. La sección 8 junta las preguntas que conviene que revise quien dio o tomó el taller.

---

## 1. Inventario de las fuentes

Todos los documentos están en [`/fuentes`](fuentes/) tal como llegaron. En
[`/fuentes/texto`](fuentes/texto/) hay una transcripción de texto de cada uno
(generada con `scripts/transcribir-fuentes.py`) para poder buscar y citar. Los
cuatro tienen texto digital: **no hizo falta OCR**.

| Id en los datos | Documento | Archivo | Qué es |
|---|---|---|---|
| `guia-digestiva` | Guía práctica «Plantas medicinales para el sistema digestivo» | `guia_plantas_medicinales.pdf` (14 págs.) | Guía para llevar a casa del taller digestivo. Firmada por Ayelén (Mburucuyá hierbas). |
| `taller-digestivo` | Presentación «Taller: Plantas medicinales para el sistema digestivo. Cómo incorporarlas en tu día a día» | `taller_plantas_medicinales.pptx` (15 diapositivas) | Diapositivas del mismo taller. Fecha impresa: «Sábado 9 de mayo de 2025». |
| `taller-estres` | Presentación «Plantas medicinales para el estrés y el descanso» | `Taller_18-4.pptx` (14 diapositivas) | Ayelén Florencia Crespi – Mburucuyá hierbas, 18 de abril de 2026. |
| `guia-inmunidad` | «Guía de acompañamiento del taller: Inmunidad inteligente» | `guia-inmunidad-inteligente-2.pdf` (41 págs.) | Guía del taller de inmunidad, hongos y adaptógenos. mburucuyá · hierbas. |

En los datos, cada dato lleva su fuente con la forma `id/número`, donde el número
es la **página del PDF** (la que muestra el visor, no el número impreso) o la
**diapositiva**. Por ejemplo `guia-digestiva/5` o `taller-estres/7`.

### 1.1 Guía digestiva (`guia-digestiva`)

- Pág. 2 — Carta «Una palabra antes de empezar».
- Pág. 3 — El sistema digestivo: boca, esófago, estómago, intestino delgado, intestino grueso, hígado y vesícula.
- Pág. 4 — Glosario básico: efecto adverso, contraindicación, interacción, dosis.
- Págs. 5–10 — **16 fichas**, todas con el mismo formato (nombre científico, compuesto activo, acciones, indicaciones, contraindicaciones, efectos adversos, interacciones, forma de uso): boldo, alcaucil, cardo mariano, diente de león, menta, manzanilla, cedrón, hinojo, jengibre, anís verde, genciana, romero, regaliz, malva, sábila, lavanda.
- Págs. 11–12 — **3 recetas**: infusión antináuseas, amargo aperitivo digestivo, vinagre fermentado de lavanda (con variantes).
- Págs. 13–14 — Tinturas madre: tabla infusión vs. tintura, proporciones de alcohol/agua según la parte de la planta, procedimiento general en 8 pasos, vencimiento, nota sobre cardo mariano.

### 1.2 Presentación del taller digestivo (`taller-digestivo`)

- Diap. 2 — Temario.
- Diaps. 3–4 — Sistema digestivo (esquema y diagrama de Wikimedia Commons, dominio público).
- Diap. 5 — Categorías de acción.
- Diaps. 6–11 — Una diapositiva por categoría (colagogas/coleréticas, antiespasmódicas, carminativas, digestivas y amargas, antiinflamatorias de la mucosa, antieméticas), cada una con mecanismo, órganos donde actúa, tabla de plantas y una advertencia.
- Diap. 8 — **Comino** (*Cuminum cyminum*): es la única planta que aparece solo acá, sin ficha en la guía.
- Diap. 12 — Probióticos y microbiota; vinagre fermentado de lavanda en 3 pasos.
- Diap. 13 — Cómo se preparan: infusión, decocción, tintura, extracto seco, aceite esencial, fresco/especia.
- Diap. 14 — Precauciones generales y buenas prácticas.

### 1.3 Presentación estrés y descanso (`taller-estres`)

- Diaps. 2–3 — Qué pasa en el cuerpo con el estrés y el sueño; estrés ≠ descanso; ansiolíticos e hipnóticos.
- Diap. 4 — Cómo usar plantas: saquito vs. planta suelta; de qué depende el efecto.
- Diap. 5 — Plantas de día (melisa, lavanda) y de noche (pasiflora, valeriana).
- Diaps. 6–9 — **4 fichas**: melisa, lavanda, pasionaria, valeriana (para qué sirve, cómo usarla con gramos por litro, cómo actúa, a tener en cuenta).
- Diaps. 10–13 — ¿Actúan de inmediato?, plantas vs. medicamentos, cómo usarlas en la práctica (prueba de 2–4 semanas, registrar, ajustar), para llevarse hoy.
- Imágenes: tres láminas de *Köhler's Medizinal-Pflanzen* (melisa, lavanda, valeriana) y dibujos decorativos.

### 1.4 Guía Inmunidad inteligente (`guia-inmunidad`)

- Pág. 2 — Carta «Antes de empezar» y «Lo que esta guía no es». **Aclara que a propósito no da dosis**, solo recetas de preparación.
- Parte 1 (págs. 4–5) — El sistema inmune: vigila, responde, recuerda; innata vs. adquirida; por qué «subir las defensas» es una idea equivocada.
- Parte 2 (págs. 6–7) — Los dos caminos: aliviar un síntoma (camino A) vs. modular (camino B). Tabla del camino A con **plantas que no tienen ficha**: llantén, malvavisco, tomillo, eucalipto, cúrcuma, sauce, tilo, saúco, equinácea (y malva y jengibre, que sí tienen ficha).
- Parte 3 (págs. 8–9) — Qué es un adaptógeno: historia, 3 criterios, lo que no es, estado de la evidencia.
- Parte 4 (págs. 10–19) — Los hongos: biología, pared celular, betaglucanos, dónde está cada compuesto; **fichas** de reishi, melena de león, cordyceps, shiitake y maitake (estos dos en una sola ficha).
- Parte 5 (págs. 20–27) — **Fichas** de ashwagandha, astrágalo, rhodiola y tulsi.
- Parte 6 (págs. 28–33) — Cómo se preparan: tabla de métodos, el mito de la doble extracción, **6 recetas** (decocción de hongo, bebida con polvo de hongo, decocción de astrágalo, infusión de tulsi, melena salteada, shiitake bien cocido), sobre las tinturas, los cinco errores más frecuentes.
- Parte 7 (págs. 34–35) — Cómo elegir un producto: qué mirar en la etiqueta, formatos, gomitas, tres preguntas para quien vende.
- Parte 8 (págs. 36–38) — Seguridad: cuándo no empezar, mapa de interacciones, antes de una cirugía, señales para suspender y consultar, qué contarle al médico.
- Págs. 39–41 — Para cerrar y bibliografía (21 referencias).

### 1.5 Plantas y hongos: en qué documento aparece cada uno

| Planta / hongo | Guía digestiva | Taller digestivo | Taller estrés | Guía inmunidad | Tipo de ficha |
|---|:-:|:-:|:-:|:-:|---|
| Boldo | ✔ | ✔ | | | completa |
| Alcaucil | ✔ | ✔ | | | completa |
| Cardo mariano | ✔ | ✔ | | | completa |
| Diente de león | ✔ | ✔ | | | completa |
| Menta | ✔ | ✔ | | | completa |
| Manzanilla | ✔ | ✔ | | mención | completa |
| Cedrón | ✔ | ✔ | | | completa |
| Hinojo | ✔ | ✔ | | | completa |
| Jengibre | ✔ | ✔ | | mención | completa |
| Anís verde | ✔ | ✔ | | | completa |
| Genciana | ✔ | ✔ | | | completa |
| Romero | ✔ | ✔ | | | completa |
| Regaliz | ✔ | ✔ | | | completa |
| Malva | ✔ | ✔ | | mención | completa |
| Sábila | ✔ | ✔ | | | completa |
| Lavanda | ✔ | ✔ | ✔ | | completa (dos fuentes) |
| Comino | | ✔ | | | breve |
| Melisa | | | ✔ | | completa |
| Pasionaria (pasiflora) | | | ✔ | | completa |
| Valeriana | | | ✔ | | completa |
| Reishi | | | | ✔ | completa |
| Melena de león | | | | ✔ | completa |
| Cordyceps | | | | ✔ | completa |
| Shiitake y maitake | | | | ✔ | completa (una ficha, como en la guía) |
| Ashwagandha | | | | ✔ | completa |
| Astrágalo | | | | ✔ | completa |
| Rhodiola | | | | ✔ | completa |
| Tulsi | | | | ✔ | completa |
| Llantén, malvavisco, tomillo, eucalipto, cúrcuma, sauce, tilo, saúco, equinácea | | (cúrcuma: mención) | | ✔ (una línea) | breves |

Mencionadas sin datos suficientes para una ficha: hipérico (ejemplo de
interacción, `taller-digestivo/14`), carqueja y naranja amarga (ingredientes del
amargo), rosa y caléndula (variantes del vinagre), ajo (fresco/especia), chaga
(tabla de métodos). Aparecen en las recetas y temas donde se las nombra, y el
buscador las encuentra.

---

## 2. Qué se extrajo y dónde quedó

| Contenido | Cantidad | Dónde está en el sitio | Archivos de datos |
|---|---|---|---|
| Fichas completas | 27 | /plantas/… | `src/content/plantas/*.yaml` |
| Fichas breves (el taller solo las menciona) | 10 (incluye el comino) | /plantas/… (marcadas «ficha breve») | ídem |
| Recetas | 10 | /recetas/… | `src/content/recetas/*.yaml` |
| Preparaciones | 8 (infusión, decocción, tintura, extracto, aceite esencial, en la comida, polvo, fermentados) | /preparaciones/… | `src/content/preparaciones/*.yaml` |
| Temas del taller | 10 | /aprender/…, /seguridad/, /el-taller/ | `src/content/temas/*.md` |
| Categorías de acción (diaps. 5–11) | 6 | /aprender/como-actuan/ y en cada ficha | `src/data/categorias.yaml` |
| Glosario | 56 términos (45 del material, 11 agregados) | /glosario/ | `src/data/glosario.yaml` |
| Índice por uso | 23 usos en 4 grupos | /usos/… | `src/data/usos.yaml` |

Cada dato de las fichas, recetas y preparaciones tiene su fuente (`de: documento/página`), y el
sitio la muestra debajo («Fuente: Guía digestiva, pág. 5»). Cuando un mismo apartado junta datos de
documentos distintos, se agrupan: «Según la Guía digestiva, pág. 10: …», «Según el taller de estrés
y descanso, diap. 7: …».

Las precauciones de cada ficha (contraindicaciones, efectos adversos, interacciones, «cuándo tener
cuidado» y los recuadros de seguridad, como el de hepatotoxicidad de la ashwagandha o la dermatitis
por shiitake) van en un recuadro propio, arriba, justo después de «Para qué se usa».

---

## 3. Lo que estaba ambiguo o no coincidía entre documentos

Las diferencias que importan para la seguridad se muestran también en la ficha, en un recuadro
«Los materiales no coinciden en todo».

### 3.1 Diferencias entre documentos

1. **Lavanda: interacciones.** La guía digestiva (pág. 10) dice «No se conocen interacciones
   significativas con el uso de la planta en infusión o fermentado». La presentación de estrés y
   descanso (diap. 7) dice que «Puede potenciar fármacos que actúan sobre GABA (ej: clonazepam,
   alprazolam)». En la ficha se muestran las dos, con la advertencia primero.
2. **Lavanda: embarazo.** La guía digestiva pide evitar el *aceite esencial* en uso interno; la
   presentación de estrés dice «Evitar en embarazo y lactancia» sin distinguir. Se muestran las dos.
3. **Lavanda: cantidad.** «1 cucharadita por taza» (guía digestiva) y «~8 g/L de agua»
   (presentación de estrés). Son dos maneras de medir; se muestran las dos.
4. **Jengibre y embarazo.** La receta de infusión antináuseas (guía, pág. 11) dice «En caso de
   embarazo, consumir solo con jengibre (omitir la manzanilla)». La ficha (pág. 8) dice «En dosis
   altas durante el embarazo: consultar al médico» y la diapositiva 11 dice «En náuseas del
   embarazo, consultar al profesional antes de usar». Se muestran las tres y una nota.
5. **Tintura madre.** La presentación digestiva (diap. 13) dice «Planta en alcohol (40–70%) durante
   15–30 días». La guía digestiva (págs. 13–14) da 50–90% según la parte de la planta y una
   maceración de 12 a 28 días. La página de la tintura muestra las dos y aclara que la guía es la
   que da el detalle.
6. **Compuestos activos con pequeñas diferencias** entre la guía y las diapositivas: hinojo
   («Anetol» / «Anetol, fenchona»), manzanilla («Apigenina» / «Apigenina, alfa-bisabolol»),
   jengibre («Gingeroles y shogaoles (fenoles)» / «Gingeroles (fenilalcanoides)» en la diap. 9). La
   ficha muestra lo de la guía y, en «En las diapositivas del taller», lo de cada diapositiva.
7. **Manzanilla, forma de uso.** La guía dice «Infusión de flores» (1 cucharada por taza); la
   diapositiva 10 dice «Infusión concentrada», sin decir cuánto.
8. **Decocción: tiempos.** La diapositiva 13 dice hervir 10–20 minutos; la guía de inmunidad pide
   40–60 minutos para hongos y 30–45 para la raíz de astrágalo. No es una contradicción (son
   materiales distintos) y la página de la decocción lo explica.
9. **Pasiflora / pasionaria.** La diapositiva 5 dice «Pasiflora» y la 8 titula «Pasionaria». La
   ficha se llama Pasionaria y tiene «Pasiflora» como otro nombre.

### 3.2 Cosas que pueden confundir en un mismo documento

1. **Sábila y colon irritable.** Está indicada para «Colon irritable» y a la vez contraindicada en
   «Síndrome de colon irritable severo». Se dejó tal cual.
2. **Regaliz «DGL (desglicolado)».** El término habitual es *desglicirricinado* (sin
   glicirricina). Probablemente sea un error de tipeo en la guía; se dejó como está en el original.
3. **Fecha del taller digestivo.** La portada dice «Sábado 9 de mayo de 2025», pero el 9 de mayo de
   2025 fue viernes (el 9 de mayo de 2026 sí es sábado). No se usa en el sitio.
4. **Amargo aperitivo.** Pide «30 g de diente de león» sin decir qué parte (hoja o raíz).
5. **Tintura madre: cantidad de líquido.** El procedimiento dice «100 g de hierba» y «el resto del
   agua correspondiente y luego el alcohol», y la tabla da los porcentajes, pero **no dice cuánto
   líquido total** usar para esos 100 g.
6. **Shiitake y maitake** están juntos en una sola ficha en la guía; así quedaron en el sitio.

---

## 4. Lo que falta en el material

1. **Cultivo y recolección:** ningún documento lo trata. Esa sección no aparece en las fichas.
2. **Fichas breves.** Llantén, malvavisco, tomillo, eucalipto, cúrcuma, sauce, tilo, saúco y
   equinácea aparecen en una sola fila de tabla de la guía de inmunidad (pág. 7). No tienen
   preparación, cantidades ni precauciones propias (salvo sauce y equinácea, que tienen una línea).
   El **comino** está solo en la diapositiva 8, sin precauciones.
3. **Dosis en la guía de inmunidad:** a propósito no las da («Tampoco vas a encontrar dosis, y eso
   es a propósito», pág. 2). Las fichas de hongos y adaptógenos no tienen cantidades, salvo las de
   las recetas de preparación.
4. **Parte de la planta** que no dicen los documentos: jengibre, genciana, regaliz y comino. Se
   agregó (marcado como agregado): rizoma, raíz, raíz y frutos.
5. **Nombres científicos** de las fichas breves: no están en el material. Se agregaron, marcados,
   a nivel de género cuando la especie es incierta (por ejemplo *Tilia spp.*).
6. **Plantas nombradas sin ningún dato:** hipérico (ejemplo de interacción), carqueja y naranja
   amarga (ingredientes del amargo), rosa y caléndula (variantes del vinagre), ajo (fresco/especia),
   chaga (tabla de métodos). No tienen ficha; el buscador las encuentra en las páginas donde se
   nombran.
7. **Láminas botánicas:** solo hay 3 (melisa, lavanda, valeriana, las mismas de la presentación).
   Para las otras 34 falta correr `npm run laminas` desde una computadora con acceso a Wikimedia
   Commons (ver README).

---

## 5. Lo que agregué yo (y está marcado)

Nada de esto cambia usos, dosis, preparaciones ni propiedades. En el sitio aparece con la marca
«agregado».

- **Familia botánica** de cada planta u hongo (salvo la ashwagandha, que la dice la guía),
  verificada. Donde la clasificación cambió, hay una nota (valeriana: antes Valerianaceae; tilo:
  antes Tiliaceae; saúco: Viburnaceae, antes Adoxaceae; maitake: Grifolaceae o Meripilaceae).
- **Notas de nomenclatura:** romero (hoy también *Salvia rosmarinus*), *Cordyceps sinensis* (hoy
  *Ophiocordyceps sinensis*).
- **Otro nombre:** «albahaca sagrada» para el tulsi.
- **Partes usadas** y **nombres científicos** de la sección 4.
- **11 definiciones del glosario** que el material usa sin explicar: dispepsia, meteorismo,
  emoliente, hepatoprotectora, diurética, peristaltismo, termolábil, anticoagulante, antiagregante,
  antihipertensivo, hipolipemiante.
- **El índice por uso** (qué planta va en «Sueño y descanso», etc.) y las **alertas** («Cuidado
  especial con: embarazo, lactancia…») son una clasificación mía hecha a partir del texto de cada
  ficha. Cada alerta tiene que estar respaldada por el texto de sus precauciones (el build lo
  controla).
- **Notas de edición:** los recuadros «Los materiales no coinciden en todo», el aviso de «Ficha
  breve» y dos aclaraciones en los usos «Inmunidad» y «Resfrío y fiebre» (qué es camino A y camino
  B, con enlace al tema).

## 6. Ajustes de redacción mínimos

Para que el texto se entienda fuera del documento original:

- Referencias internas: «Ver recuadro» → «Ver el recuadro «Hepatotoxicidad»»; «ver el recuadro
  siguiente» → «ver el recuadro «Dermatitis por shiitake»»; «Confundirlas produce…» → «Confundir
  los dos caminos produce…». Se quitó «En la Parte 6 está el paso a paso» (en su lugar hay un
  enlace a la receta).
- Filas de tabla convertidas en oraciones, por ejemplo «Llantén, malva y malvavisco contienen
  mucílagos: …» (en la guía es una fila con tres columnas).
- Algunas citas van entre comillas «» con una frase de introducción, por ejemplo «Para el día
  (estrés / ansiedad leve): melisa y lavanda «ayudan a reducir el nerviosismo…»».

## 7. Cómo se verificó

- **Esquema:** al compilar, cada ficha se valida (campos obligatorios, que cada fuente exista y que
  la página o diapositiva esté dentro del documento, que los usos, recetas y láminas citados
  existan, y que ninguna ficha tenga alertas sin texto de precaución que las respalde).
- **Fidelidad:** `python3 scripts/verificar-fidelidad.py` compara cada dato con el texto de la
  página citada. De 399 datos revisados, 46 tienen algún fragmento que no es literal; los revisé
  uno por uno: son las reformulaciones de la sección 6. Encontré y corregí un error de cita
  (melisa: «combinado» en lugar de «combinada»).
- **Enlaces:** `npm run links` revisa los 3.794 enlaces internos de las 100 páginas: 0 rotos.
- **Sin conexión:** `npm run offline` corta la red y navega fichas, recetas, filtros, búsqueda y
  láminas.

## 8. Para revisar con quien dio el taller

1. ¿Está bien mostrar las dos versiones en lavanda (interacciones y embarazo) y en jengibre
   (embarazo), o una de las dos corrige a la otra?
2. Tintura madre: ¿cuánto líquido total va para 100 g de hierba? ¿Vale 40–70% o 50–90%?
3. Amargo aperitivo: ¿hoja o raíz de diente de león?
4. Regaliz: ¿«desglicolado» es «desglicirricinado»?
5. ¿Se quieren fichas más completas para las plantas breves (llantén, tomillo, tilo…)? Hoy tienen
   solo lo que dice el material.
6. ¿El taller digestivo fue en 2025 o en 2026?
