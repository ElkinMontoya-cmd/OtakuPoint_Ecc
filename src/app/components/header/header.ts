import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../service/carrito';

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

  constructor(private carritoService: CarritoService) {

    this.carritoService.items$.subscribe(items => {

      this.totalItems = items.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );

    });

  }

  abrir() {
    this.abrirCarrito.emit();
  }

}