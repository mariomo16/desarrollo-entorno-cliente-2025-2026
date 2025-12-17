import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapatillasComponent } from './zapatillas-component';

describe('ZapatillasComponent', () => {
  let component: ZapatillasComponent;
  let fixture: ComponentFixture<ZapatillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZapatillasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZapatillasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
