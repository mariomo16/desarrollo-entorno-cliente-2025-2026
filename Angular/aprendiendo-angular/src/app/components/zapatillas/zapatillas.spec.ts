import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zapatillas } from './zapatillas';

describe('Zapatillas', () => {
  let component: Zapatillas;
  let fixture: ComponentFixture<Zapatillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zapatillas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zapatillas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
