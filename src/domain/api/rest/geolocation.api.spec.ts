import { Geolocation } from './geolocation.api';
import { TestBed } from '@angular/core/testing';


describe('Geolocation', () => {
  let service: Geolocation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geolocation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
