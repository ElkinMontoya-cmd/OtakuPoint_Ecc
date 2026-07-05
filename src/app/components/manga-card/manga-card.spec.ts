import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCardComponent } from './manga-card';

describe('MangaCard', () => {
  let component: MangaCardComponent;
  let fixture: ComponentFixture<MangaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MangaCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
