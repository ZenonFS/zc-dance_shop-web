import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TightsCombination } from './tights-combination';

describe('TightsCombination', () => {
  let component: TightsCombination;
  let fixture: ComponentFixture<TightsCombination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TightsCombination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TightsCombination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
