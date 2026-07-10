import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lazy-image.html',
  styleUrls: ['./lazy-image.css']
})
export class LazyImageComponent {
 
  @Input() src = '';
 
  @Input() alt = '';
 
  cargada = false;
 
  error = false;
 
  onLoad(): void {
    this.cargada = true;
  }
 
  onError(): void {
    console.error(`[lazy-image] No se pudo cargar la imagen: ${this.src}`);
    this.error = true;
    this.cargada = true; // oculta el skeleton, se muestra el aviso de "sin imagen"
  }
}