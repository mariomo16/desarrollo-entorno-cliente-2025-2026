import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoComponent } from './videojuego-component';

describe('VideojuegoComponent', () => {
  let component: VideojuegoComponent;
  let fixture: ComponentFixture<VideojuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
