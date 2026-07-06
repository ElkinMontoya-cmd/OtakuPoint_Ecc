import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaDetalleComponent } from './manga-detalle';
import { CarritoService } from '../../service/carrito';
import { ToastService } from '../../service/toast';

describe('MangaDetalle', () => {
  let component: MangaDetalleComponent;
  let fixture: ComponentFixture<MangaDetalleComponent>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    carritoService = jasmine.createSpyObj('CarritoService', ['agregarAlCarrito']);
    toastService = jasmine.createSpyObj('ToastService', ['mostrar']);

    await TestBed.configureTestingModule({
      imports: [MangaDetalleComponent],
      providers: [
        { provide: CarritoService, useValue: carritoService },
        { provide: ToastService, useValue: toastService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MangaDetalleComponent);
    component = fixture.componentInstance;
    component.manga = {
      id: 1,
      titulo: 'CHAINSAW MAN',
      autor: 'TATSUKI FUJIMOTO',
      tipoPublicacion: 'Tomos con Sobrecubierta',
      sinopsis: 'Prueba',
      portadaUrl: '/chainsawman/01.jpg',
      generos: ['Acción'],
      estado: 'STOCK',
      tomos: []
    } as any;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show a second toast from the detail component when adding to cart', () => {
    const tomo = { numero: 'Volumen 1', imagenUrl: '/chainsawman/01.jpg', precio: 14.5, estado: 'STOCK' };

    component.agregarAlCarrito(tomo);

    expect(carritoService.agregarAlCarrito).toHaveBeenCalledWith(component.manga.titulo, tomo);
    expect(toastService.mostrar).not.toHaveBeenCalled();
  });
});
