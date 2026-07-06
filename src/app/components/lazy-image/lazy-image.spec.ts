import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyImage } from './lazy-image';

describe('LazyImage', () => {
  let component: LazyImage;
  let fixture: ComponentFixture<LazyImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyImage],
    }).compileComponents();

    fixture = TestBed.createComponent(LazyImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
