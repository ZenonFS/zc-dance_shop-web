import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoeBrush } from './shoe-brush';

describe('ShoeBrush', () => {
  let component: ShoeBrush;
  let fixture: ComponentFixture<ShoeBrush>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoeBrush]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoeBrush);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
