import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPreference } from './color-preference';

describe('ColorPreference', () => {
  let component: ColorPreference;
  let fixture: ComponentFixture<ColorPreference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPreference]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPreference);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
