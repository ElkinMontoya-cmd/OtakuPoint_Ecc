import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../service/toast';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {

  constructor(public toastService : ToastService){}

  imagenCargada() {
  console.log('Imagen cargada correctamente');
}

errorImagen(event: Event) {
  console.log('Error al cargar la imagen');
  console.log((event.target as HTMLImageElement).src);
}


}
