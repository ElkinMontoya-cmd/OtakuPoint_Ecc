import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../service/carrito';
import { ThemeService } from '../../service/theme';
 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
 
  @Output() abrirCarrito = new EventEmitter<void>();
 
  totalItems = 0;
  oscuro = false;
 
  constructor(private carritoService: CarritoService, private themeService: ThemeService) {
 
    this.carritoService.items$.subscribe(items => {
 
      this.totalItems = items.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );
 
    });
 
    this.themeService.oscuro$.subscribe(oscuro => {
      this.oscuro = oscuro;
    });
 
  }
 
  abrir() {
    this.abrirCarrito.emit();
  }
 
  toggleTema() {
    this.themeService.toggle();
  }
 
}