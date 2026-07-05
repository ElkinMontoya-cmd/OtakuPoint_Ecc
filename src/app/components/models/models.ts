export interface Tomo {
  numero: string;       
  imagenUrl: string;    
  precio: number;
  estado: 'STOCK' | 'PREVENTA' | 'RESERVA';
}

export interface Manga {
  id: number;
  titulo: string;
  autor: string;
  tipoPublicacion: string;
  sinopsis: string;
  portadaUrl: string;   
  generos: string[];
  estado: 'STOCK' | 'PREVENTA' | 'RESERVA'; 
  tomos: Tomo[];        
}