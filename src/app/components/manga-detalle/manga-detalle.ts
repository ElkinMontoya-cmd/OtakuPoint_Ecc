import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manga } from '../models/models';
import { CarritoService } from '../../service/carrito';

@Component({
  selector: 'app-manga-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manga-detalle.html',
  styleUrls: ['./manga-detalle.css']
})
export class MangaDetalleComponent {
  @Input() manga!: Manga;
  @Output() cerrar = new EventEmitter<void>();

  // Variable para el visor de imágenes
  imagenAmpliadaUrl: string | null = null;

  constructor(private carritoService: CarritoService) {}

  cerrarModal() {
    this.cerrar.emit();
  }

  // Cierra el modal de detalles solo si tocas el fondo oscuro exterior
  cerrarAlClickearFondo(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.cerrarModal();
    }
  }

  abrirVisor(url: string) {
    this.imagenAmpliadaUrl = url;
  }

  cerrarVisor() {
    this.imagenAmpliadaUrl = null;
  }

  agregarAlCarrito(tomo: any) {
    this.carritoService.agregarAlCarrito(this.manga.titulo, tomo);
  }

}