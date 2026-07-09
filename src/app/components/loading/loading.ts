import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  // Cuántas tarjetas "fantasma" mostrar mientras carga (ajústalo según tu grid)
  @Input() cantidad = 8;
 
  // Solo para poder hacer *ngFor sin necesitar un array real
  get repetir(): number[] {
    return Array.from({ length: this.cantidad });
  }
}