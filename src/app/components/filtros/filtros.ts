import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectPersonalizadoComponent } from '../select-personalizado/select-personalizado';
 
@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectPersonalizadoComponent],
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css']
})
export class FiltrosComponent {
  @Input() generos: string[] = [];
  @Output() alCambiarFiltro = new EventEmitter<any>();
 
  buscarTexto: string = '';
  generoSeleccionado: string = '';
  estadoSeleccionado: string = '';
 
  readonly opcionesEstado = ['STOCK', 'PREVENTA', 'RESERVA'];
 
  notificarCambio() {
    this.alCambiarFiltro.emit({
      buscar: this.buscarTexto,
      genero: this.generoSeleccionado,
      estado: this.estadoSeleccionado
    });
  }
}