import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeelProtectors } from './heel-protectors';

describe('HeelProtectors', () => {
  let component: HeelProtectors;
  let fixture: ComponentFixture<HeelProtectors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeelProtectors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeelProtectors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
