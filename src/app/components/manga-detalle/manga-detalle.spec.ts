import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaDetalleComponent } from './manga-detalle';

describe('MangaDetalle', () => {
  let component: MangaDetalleComponent;
  let fixture: ComponentFixture<MangaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangaDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MangaDetalleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
