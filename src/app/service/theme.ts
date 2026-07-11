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
 
    const oscuro =
      guardado !== null
        ? guardado
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
 
    this.aplicar(oscuro);
 
    // Si el usuario nunca eligió manualmente, sigue el tema del sistema
    // en caso de que lo cambie mientras tiene la página abierta.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.leerPreferenciaGuardada() === null) {
        this.aplicar(e.matches);
      }
    });
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