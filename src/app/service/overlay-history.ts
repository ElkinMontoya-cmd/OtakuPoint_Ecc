import { Injectable } from '@angular/core';
 
// ---------------------------------------------------------------------
// Hace que el botón/gesto de "regresar" del celular cierre lo que esté
// abierto (carrito, detalle de un manga, un dropdown personalizado)
// en vez de sacar al usuario de la página.
//
// Cómo funciona: cuando algo se abre, agregamos una entrada "falsa" al
// historial del navegador. Si el usuario presiona/desliza "atrás", el
// navegador consume esa entrada (dispara "popstate") y nosotros
// aprovechamos ese momento para cerrar lo que corresponda, en vez de
// dejar que el navegador siga retrocediendo hacia otra página.
// ---------------------------------------------------------------------
@Injectable({
  providedIn: 'root',
})
export class OverlayHistoryService {
  private pilaCierres: (() => void)[] = [];
  private ignorarProximoPopstate = false;
 
  constructor() {
    window.addEventListener('popstate', () => {
      if (this.ignorarProximoPopstate) {
        this.ignorarProximoPopstate = false;
        return;
      }
 
      const cerrar = this.pilaCierres.pop();
      if (cerrar) {
        cerrar();
      }
    });
  }
 
  /** Llamar justo cuando se ABRE un overlay (carrito, modal, dropdown...) */
  abrir(alCerrarPorBack: () => void): void {
    history.pushState({ overlayOtakuPoint: true }, '');
    this.pilaCierres.push(alCerrarPorBack);
  }
 
  /** Llamar cuando el overlay se cierra por una acción normal (click en X, click afuera, etc.) */
  cerrar(): void {
    if (this.pilaCierres.length > 0) {
      this.pilaCierres.pop();
      this.ignorarProximoPopstate = true;
      history.back();
    }
  }
}