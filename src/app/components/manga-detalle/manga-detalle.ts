import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manga } from '../models/models';
import { CarritoService } from '../../service/carrito';
import { LazyImageComponent } from '../lazy-image/lazy-image';
 
@Component({
  selector: 'app-manga-detalle',
  standalone: true,
  imports: [CommonModule, LazyImageComponent],
  templateUrl: './manga-detalle.html',
  styleUrls: ['./manga-detalle.css']
})
export class MangaDetalleComponent implements OnInit, OnDestroy {
  @Input() manga!: Manga;
  @Output() cerrar = new EventEmitter<void>();
 
  // Variable para el visor de imágenes
  imagenAmpliadaUrl: string | null = null;
 
  constructor(private carritoService: CarritoService) {}
 
  ngOnInit() {
    // Bloquear el scroll del body cuando se abre el detalle
    document.body.style.overflow = 'hidden';
  }
 
  ngOnDestroy() {
    // Desbloquear el scroll cuando se cierra
    document.body.style.overflow = 'auto';
  }
 
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