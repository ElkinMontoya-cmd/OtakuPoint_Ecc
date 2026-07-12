import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayHistoryService } from '../../service/overlay-history';
 
@Component({
  selector: 'app-select-personalizado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-personalizado.html',
  styleUrl: './select-personalizado.css',
})
export class SelectPersonalizadoComponent {
  @Input() opciones: string[] = [];
  @Input() valor = '';
  @Input() placeholder = 'Seleccionar';
  @Output() valorChange = new EventEmitter<string>();
 
  abierto = false;
 
  constructor(private elementRef: ElementRef, private overlayHistory: OverlayHistoryService) {}
 
  toggle(): void {
    if (this.abierto) {
      this.cerrar();
    } else {
      this.abierto = true;
      this.overlayHistory.abrir(() => (this.abierto = false));
    }
  }
 
  cerrar(): void {
    if (this.abierto) {
      this.abierto = false;
      this.overlayHistory.cerrar();
    }
  }
 
  elegir(opcion: string): void {
    this.valor = opcion;
    this.valorChange.emit(opcion);
    this.cerrar();
  }
}