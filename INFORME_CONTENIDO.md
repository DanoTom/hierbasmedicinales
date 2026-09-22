# Informe de contenido

Este informe es para revisar el contenido del sitio contra el material del taller.
Dice qué se sacó de cada documento, qué estaba ambiguo o no coincidía entre
documentos, y qué falta.

> Estado: **inventario inicial** (se completa al terminar la carga de fichas).

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
