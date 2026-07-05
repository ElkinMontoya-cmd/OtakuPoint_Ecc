import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Agrega esto
import { Manga } from '../models/models'; // Apunta a tu archivo de modelos actual

@Component({
  selector: 'app-manga-card',
  standalone: true,
  imports: [CommonModule], // <-- Ponlo aquí para que funcione el [ngClass] de los badges
  templateUrl: './manga-card.html',
  styleUrls: ['./manga-card.css']
})
export class MangaCardComponent {
  @Input() manga!: Manga;
  @Output() mangaSeleccionado = new EventEmitter<Manga>();

  verDetalles() {
    this.mangaSeleccionado.emit(this.manga);
  }
}