import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { Manga } from '../models/models';
 
// Importa los componentes hijos directamente aquí:
import { HeaderComponent } from '../header/header';
import { FiltrosComponent } from '../filtros/filtros';
import { MangaCardComponent } from '../manga-card/manga-card';
import { MangaDetalleComponent } from '../manga-detalle/manga-detalle';
import { MangaService } from '../../service/manga';
import { CarritoService, ItemCarrito } from '../../service/carrito';
import { ToastComponent } from '../toast/toast';
import { Loading } from '../loading/loading';
import { OverlayHistoryService } from '../../service/overlay-history';
 
 
 
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FiltrosComponent,
    MangaCardComponent,
    MangaDetalleComponent,
    ToastComponent,
    Loading
  ], // <-- Al agregarlos aquí, desaparece cualquier error en catalogo.html
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  // Propiedades del Catálogo
  todosLosMangas: Manga[] = [];
  mangasFiltrados: Manga[] = [];
  generos: string[] = [];
  mangaSeleccionadoParaVer: Manga | null = null;
  cargando = true;
 
  // Propiedades del Carrito (Agregadas)
  mostrarCarrito = false;
  itemsCarrito: ItemCarrito[] = [];
  totalItems = 0;
  totalPagar = 0;
 
  // Constructor Unificado
  constructor(
    private MangaService: MangaService,
    private carritoService: CarritoService,
    private overlayHistory: OverlayHistoryService
  ) {}
 
  // ngOnInit Unificado
  ngOnInit(): void {
    this.MangaService.cargando$().subscribe(cargando => {
      this.cargando = cargando;
    });
 
    this.MangaService.getMangas().subscribe(mangas => {
      this.todosLosMangas = mangas;
      this.mangasFiltrados = mangas;
      this.generos = this.MangaService.getGenerosDisponibles();
      this.ordenarAlfabeticamente();
    });
 
    this.carritoService.items$.subscribe(items => {
      this.itemsCarrito = items;
      this.totalItems = this.carritoService.obtenerTotalItems();
      this.totalPagar = this.carritoService.obtenerTotal();
    });
  }
 
  // Lógica de Filtros
  filtrarCatalogo(filtros: { buscar: string, genero: string, estado: string }) {
    this.mangasFiltrados = this.todosLosMangas.filter(manga => {
      const cumpleBusqueda = manga.titulo.toLowerCase().includes(filtros.buscar.toLowerCase());
      const cumpleGenero = filtros.genero === '' || manga.generos.includes(filtros.genero);
      const cumpleEstado = filtros.estado === '' || manga.estado === filtros.estado;
      return cumpleBusqueda && cumpleGenero && cumpleEstado;
    });
 
    this.ordenarAlfabeticamente();
  }
 
  // Métodos de apoyo para ordenamiento
  private ordenarAlfabeticamente(): void {
    this.mangasFiltrados.sort((a, b) => {
      return a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' });
    });
  }
 
abrirDetalle(manga: Manga): void {
  this.mangaSeleccionadoParaVer = manga;
  this.overlayHistory.abrir(() => {
    this.mangaSeleccionadoParaVer = null;
  });
}
 
cerrarDetalle(): void {
  this.mangaSeleccionadoParaVer = null;
  this.overlayHistory.cerrar();
}
 
  // Interacciones del Carrito
  toggleCarrito() {
    if (!this.mostrarCarrito) {
      this.mostrarCarrito = true;
      this.overlayHistory.abrir(() => {
        this.mostrarCarrito = false;
      });
    } else {
      this.mostrarCarrito = false;
      this.overlayHistory.cerrar();
    }
  }
 
  cambiarCantidad(index: number, nuevaCantidad: number) {
    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }
 
  eliminarItem(index: number) {
    this.carritoService.eliminarItem(index);
  }
 
  // Proceso de Compra Adaptativo e Inteligente para Producción (Vercel)
  iniciarCompra() {
    if (this.itemsCarrito.length === 0) return;
 
    let mensaje = `👋 ¡Hola Otaku Point! Quiero realizar el siguiente pedido:\n\n`;
    this.itemsCarrito.forEach(item => {
      mensaje += `🔹 ${item.mangaTitulo} (${item.tomoNumero}) x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    mensaje += `\n💰 TOTAL A PAGAR: $${this.totalPagar.toFixed(2)}`;
 
    // Intentar API moderna de portapapeles
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(mensaje)
        .then(() => {
          this.redireccionarInstagram();
        })
        .catch(() => {
          this.fallbackCopiado(mensaje);
        });
    } else {
      this.fallbackCopiado(mensaje);
    }
  }
 
  private fallbackCopiado(texto: string) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);
 
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('No se pudo copiar automáticamente', err);
    }
 
    document.body.removeChild(textArea);
    this.redireccionarInstagram();
  }
 
  private redireccionarInstagram() {
    alert('📋 ¡Pedido copiado al portapapeles!\n\nAl abrirse Instagram, ve a la sección de mensajes o presiona "Enviar Mensaje" en nuestro perfil y pega tu pedido. 📑');
 
    const urlWeb = 'https://www.instagram.com/otaku.point.ec/'; 
    const urlApp = 'instagram://user?username=otaku.point.ec'; 
 
    const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
 
    if (esMovil) {
      window.location.href = urlApp;
      
      setTimeout(() => {
        window.location.href = urlWeb;
      }, 600);
    } else {
      window.open('https://www.instagram.com/direct/t/18037417718624546/', '_blank');
    }
  }
}