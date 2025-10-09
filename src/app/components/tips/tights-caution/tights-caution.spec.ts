import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TightsCaution } from './tights-caution';

describe('TightsCaution', () => {
  let component: TightsCaution;
  let fixture: ComponentFixture<TightsCaution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TightsCaution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TightsCaution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
