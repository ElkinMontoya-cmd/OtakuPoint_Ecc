import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPersonalizado } from './select-personalizado';

describe('SelectPersonalizado', () => {
  let component: SelectPersonalizado;
  let fixture: ComponentFixture<SelectPersonalizado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPersonalizado],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPersonalizado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
