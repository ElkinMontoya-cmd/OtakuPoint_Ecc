import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manga } from '../models/models';
import { LazyImageComponent } from '../lazy-image/lazy-image';
 
 
@Component({
  selector: 'app-manga-card',
  standalone: true,
  imports: [CommonModule, LazyImageComponent],
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