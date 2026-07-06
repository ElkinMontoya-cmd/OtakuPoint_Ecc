import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast';

export interface ItemCarrito {
  mangaTitulo: string;
  tomoNumero: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // 1. Cargamos los ítems guardados previamente al iniciar el servicio
  private items: ItemCarrito[] = this.cargarCarritoInicial();
  
  // 2. Inicializamos el BehaviorSubject con los ítems recuperados de la memoria
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>(this.items);
  
  items$ = this.carritoSubject.asObservable();

  // 3. Método auxiliar para leer de forma segura el localStorage
  private cargarCarritoInicial(): ItemCarrito[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const datosGuardados = localStorage.getItem('otaku_point_carrito');
      return datosGuardados ? JSON.parse(datosGuardados) : [];
    }
    return [];
  }
  constructor(private toastService: ToastService) {}

  // 4. Método auxiliar para guardar el estado actual en el localStorage
  private guardarEnLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('otaku_point_carrito', JSON.stringify(this.items));
    }
  }

  agregarAlCarrito(mangaTitulo: string, tomo: any) {
    // 1. Validamos de forma inteligente la propiedad de la imagen para que nunca sea undefined
    const urlFinal = tomo.imagenUrl || tomo.imagen || tomo.portada || '';

    const itemExistente = this.items.find(
      i => i.mangaTitulo === mangaTitulo && i.tomoNumero === tomo.numero
    );

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push({
        mangaTitulo,
        tomoNumero: tomo.numero,
        precio: tomo.precio,
        cantidad: 1,
        imagenUrl: urlFinal // <-- Usamos la URL validada
      });
    }
    
    this.carritoSubject.next([...this.items]);
    this.guardarEnLocalStorage();
    
    console.log("Objeto Tomo recibido:", tomo);
    console.log("URL de imagen resuelta:", urlFinal);
    
    // 2. Le pasamos la URL resuelta al ToastService
    this.toastService.mostrar(
      'Añadido al carrito',
      `${mangaTitulo} • ${tomo.numero}`,
      urlFinal
    );
  }
  

  actualizarCantidad(index: number, cantidad: number) {
    if (cantidad <= 0) {
      this.eliminarItem(index);
    } else {
      this.items[index].cantidad = cantidad;
      this.carritoSubject.next([...this.items]);
      this.guardarEnLocalStorage(); // <-- Guarda cambios
    }
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
    this.carritoSubject.next([...this.items]);
    this.guardarEnLocalStorage(); // <-- Guarda cambios
  }

  obtenerTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  obtenerTotalItems(): number {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  limpiarCarrito() {
    this.items = [];
    this.carritoSubject.next([...this.items]);
    this.guardarEnLocalStorage(); // <-- Limpia también el almacenamiento local
  }
}