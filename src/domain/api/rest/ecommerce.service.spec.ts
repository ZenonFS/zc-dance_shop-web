import { TestBed } from '@angular/core/testing';

import { Ecommerce } from './ecommerce';

describe('Ecommerce', () => {
  let service: Ecommerce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ecommerce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
