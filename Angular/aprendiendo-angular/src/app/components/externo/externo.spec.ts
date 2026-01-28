import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Externo } from './externo';

describe('Externo', () => {
  let component: Externo;
  let fixture: ComponentFixture<Externo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Externo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Externo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
