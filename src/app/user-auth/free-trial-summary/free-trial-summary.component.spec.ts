import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialSummaryComponent } from './free-trial-summary.component';

describe('FreeTrialSummaryComponent', () => {
  let component: FreeTrialSummaryComponent;
  let fixture: ComponentFixture<FreeTrialSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTrialSummaryComponent]
    });
    fixture = TestBed.createComponent(FreeTrialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
