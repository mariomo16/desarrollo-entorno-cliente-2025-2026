import { TestBed } from '@angular/core/testing';

import { ZapatillaServices } from './zapatilla-services';

describe('ZapatillaServices', () => {
  let service: ZapatillaServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZapatillaServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
