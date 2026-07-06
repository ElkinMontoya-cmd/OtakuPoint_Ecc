import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  visible: boolean;
  titulo: string;
  mensaje: string;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private timeout: any;

  private toastSubject = new BehaviorSubject<ToastData>({ 
    visible: false,
    titulo: '',
    mensaje: '',
    imagen: ''
  });

  toast$ = this.toastSubject.asObservable();

  mostrar(titulo: string, mensaje: string, imagen?: string) {

    this.toastSubject.next({
      visible: true, 
      titulo,
      mensaje, 
      imagen
    });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {

      this.toastSubject.next({
        visible: false,
        titulo: '',
        mensaje: '',
        imagen: ''
      });

    }, 2500);

  }
  

}