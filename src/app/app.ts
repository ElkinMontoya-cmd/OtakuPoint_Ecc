import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo'; // <-- 1. Importalo

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatalogoComponent], // <-- 2. Añádelo aquí
  templateUrl: './app.html', // Según tu árbol de archivos se llama app.html
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'OtakuPoint_Ecc';
}