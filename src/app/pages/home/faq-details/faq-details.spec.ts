import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqDetails } from './faq-details';

describe('FaqDetails', () => {
  let component: FaqDetails;
  let fixture: ComponentFixture<FaqDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
