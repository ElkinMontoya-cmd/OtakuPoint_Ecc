import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el *ngFor
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORTA ESTO AQUÍ

@Component({
  selector: 'app-filtros',
  standalone: true, // Tu proyecto usa standalone por defecto
  imports: [CommonModule, FormsModule], // <-- 2. AÑÁDELO AQUÍ
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css']
})
export class FiltrosComponent {
  @Input() generos: string[] = [];
  @Output() alCambiarFiltro = new EventEmitter<any>();

  buscarTexto: string = '';
  generoSeleccionado: string = '';
  estadoSeleccionado: string = '';

  notificarCambio() {
    this.alCambiarFiltro.emit({
      buscar: this.buscarTexto,
      genero: this.generoSeleccionado,
      estado: this.estadoSeleccionado
    });
  }
}