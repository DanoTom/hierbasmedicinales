/**
 * Plantas y recetas guardadas en este dispositivo (localStorage).
 * Ids: «planta:boldo», «receta:vinagre-de-lavanda».
 */
const CLAVE = 'botica:guardadas';

export function leerGuardadas(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function escribir(lista: string[]) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    /* modo privado o almacenamiento lleno: se ignora */
  }
}

export function estaGuardada(id: string) {
  return leerGuardadas().includes(id);
}

export function alternarGuardada(id: string): boolean {
  const lista = leerGuardadas();
  const i = lista.indexOf(id);
  if (i >= 0) lista.splice(i, 1);
  else lista.unshift(id);
  escribir(lista);
  return i < 0;
}

function anunciar(mensaje: string) {
  let region = document.getElementById('anuncio-guardadas');
  if (!region) {
    region = document.createElement('div');
    region.id = 'anuncio-guardadas';
    region.className = 'solo-lector';
    region.setAttribute('role', 'status');
    document.body.append(region);
  }
  region.textContent = mensaje;
}

function pintar(boton: HTMLButtonElement) {
  const id = boton.dataset.guardar!;
  const guardada = estaGuardada(id);
  const texto = boton.querySelector('[data-guardar-texto]');
  if (texto) texto.textContent = guardada ? 'Guardada · quitar' : 'Guardar';
  boton.classList.toggle('boton--activo', guardada);
  const icono = boton.querySelector('svg');
  if (icono) icono.style.fill = guardada ? 'currentColor' : '';
}

export function iniciarBotonesGuardar() {
  document.querySelectorAll<HTMLButtonElement>('button[data-guardar]').forEach((boton) => {
    if (boton.dataset.listo) return;
    boton.dataset.listo = '1';
    boton.hidden = false;
    pintar(boton);
    boton.addEventListener('click', () => {
      const ahora = alternarGuardada(boton.dataset.guardar!);
      pintar(boton);
      anunciar(ahora ? 'Guardada en tu lista.' : 'Se quitó de tu lista.');
    });
  });
}
