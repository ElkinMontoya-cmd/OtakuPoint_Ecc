import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manga } from '../models/models';

@Component({
  selector: 'app-manga-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manga-card.html',
  styleUrls: ['./manga-card.css']
})
export class MangaCardComponent {

  @Input() manga!: Manga;

  @Output() mangaSeleccionado = new EventEmitter<Manga>();

  verDetalles(): void {
    this.mangaSeleccionado.emit(this.manga);
  }
}