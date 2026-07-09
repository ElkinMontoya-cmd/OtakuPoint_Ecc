import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Manga, Tomo } from '../components/models/models';
import { supabase } from './supabase-client';
 
// ---------------------------------------------------------------------
// Formas "crudas" tal como vienen de Postgres (snake_case)
// ---------------------------------------------------------------------
interface TomoRow {
  numero: string;
  imagen_url: string;
  precio: number;
  estado: 'STOCK' | 'PREVENTA' | 'RESERVA';
  orden: number;
}
 
interface MangaRow {
  id: number;
  titulo: string;
  autor: string;
  tipo_publicacion: string;
  sinopsis: string;
  portada_url: string;
  generos: string[];
  estado: 'STOCK' | 'PREVENTA' | 'RESERVA';
  tomos: TomoRow[];
}
 
@Injectable({
  providedIn: 'root',
})
export class MangaService {
  // Clave de caché en el navegador (versionada por si cambia la forma del dato)
  private readonly CACHE_KEY = 'otakupoint_mangas_cache_v1';
 
  // mismo patrón reactivo que ya tenías: los componentes existentes
  // (catalogo, manga-card, manga-detalle, filtros) no cambian NADA.
  private mangasSubject = new BehaviorSubject<Manga[]>([]);
 
  // Nuevo: indica si todavía no hay NADA que mostrar (ni siquiera caché).
  // Los componentes lo usan para mostrar un skeleton en vez de pantalla vacía.
  private cargandoSubject = new BehaviorSubject<boolean>(true);
 
  constructor() {
    this.cargarDesdeCache();
    this.cargarMangas();
  }
 
  getMangas(): Observable<Manga[]> {
    return this.mangasSubject.asObservable();
  }
 
  cargando$(): Observable<boolean> {
    return this.cargandoSubject.asObservable();
  }
 
  // Se sigue calculando en el cliente a partir de lo último cargado.
  getGenerosDisponibles(): string[] {
    const todosLosGeneros = this.mangasSubject.value.flatMap((m) => m.generos);
    return [...new Set(todosLosGeneros)];
  }
 
  // Útil para refrescar el catálogo manualmente (ej: botón "recargar"
  // o después de que un futuro panel de administración agregue un manga)
  recargar(): void {
    this.cargarMangas();
  }
 
  // ---------------------------------------------------------------------
  // Caché instantánea: evita la pantalla en blanco en visitas siguientes
  // ---------------------------------------------------------------------
  private cargarDesdeCache(): void {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (raw) {
        const cache: Manga[] = JSON.parse(raw);
        this.mangasSubject.next(cache);
        this.cargandoSubject.next(false); // ya hay algo que mostrar de inmediato
      }
    } catch {
      // localStorage no disponible o dato corrupto: se ignora, no es crítico
    }
  }
 
  private guardarEnCache(mangas: Manga[]): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(mangas));
    } catch {
      // almacenamiento lleno o no disponible: no debe romper la app
    }
  }
 
  private async cargarMangas(): Promise<void> {
    const { data, error } = await supabase
      .from('mangas')
      .select('*, tomos(*)')
      .order('titulo', { ascending: true });
 
    if (error) {
      console.error('Error cargando mangas desde Supabase:', error.message);
      this.cargandoSubject.next(false);
      // Si ya había caché, la dejamos como está en vez de vaciar el catálogo.
      return;
    }
 
    const mangas = (data as MangaRow[]).map((row) => this.mapRowToManga(row));
    this.mangasSubject.next(mangas);
    this.guardarEnCache(mangas);
    this.cargandoSubject.next(false);
  }
 
  private mapRowToManga(row: MangaRow): Manga {
    const tomos: Tomo[] = [...row.tomos]
      .sort((a, b) => a.orden - b.orden)
      .map((t) => ({
        numero: t.numero,
        imagenUrl: t.imagen_url,
        precio: Number(t.precio),
        estado: t.estado,
      }));
 
    return {
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      tipoPublicacion: row.tipo_publicacion,
      sinopsis: row.sinopsis,
      portadaUrl: row.portada_url,
      generos: row.generos ?? [],
      estado: row.estado,
      tomos,
    };
  }
}