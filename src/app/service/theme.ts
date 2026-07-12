import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
const CLAVE_STORAGE = 'otakupoint_tema';
 
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private oscuroSubject = new BehaviorSubject<boolean>(false);
  oscuro$ = this.oscuroSubject.asObservable();
 
  constructor() {
    const guardado = this.leerPreferenciaGuardada();
 
    // Por defecto siempre arranca en modo claro, sin importar la
    // preferencia del sistema operativo. Solo cambia si el usuario
    // lo eligió manualmente antes (guardado en localStorage).
    const oscuro = guardado !== null ? guardado : false;
 
    this.aplicar(oscuro);
  }
 
  private leerPreferenciaGuardada(): boolean | null {
    try {
      const valor = localStorage.getItem(CLAVE_STORAGE);
      if (valor === null) return null;
      return valor === 'oscuro';
    } catch {
      return null;
    }
  }
 
  private guardarPreferencia(oscuro: boolean): void {
    try {
      localStorage.setItem(CLAVE_STORAGE, oscuro ? 'oscuro' : 'claro');
    } catch {
      // localStorage no disponible: no es crítico, simplemente no persiste
    }
  }
 
  private aplicar(oscuro: boolean): void {
    document.body.classList.toggle('tema-oscuro', oscuro);
    this.oscuroSubject.next(oscuro);
  }
 
  toggle(): void {
    const nuevoValor = !this.oscuroSubject.value;
    this.aplicar(nuevoValor);
    this.guardarPreferencia(nuevoValor);
  }
 
  estaOscuro(): boolean {
    return this.oscuroSubject.value;
  }
}