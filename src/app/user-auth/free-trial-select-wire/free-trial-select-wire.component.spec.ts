import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialSelectWireComponent } from './free-trial-select-wire.component';

describe('FreeTrialSelectWireComponent', () => {
  let component: FreeTrialSelectWireComponent;
  let fixture: ComponentFixture<FreeTrialSelectWireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTrialSelectWireComponent]
    });
    fixture = TestBed.createComponent(FreeTrialSelectWireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
