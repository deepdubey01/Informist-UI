import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialCommodityWireComponent } from './free-trial-commodity-wire.component';

describe('FreeTrialCommodityWireComponent', () => {
  let component: FreeTrialCommodityWireComponent;
  let fixture: ComponentFixture<FreeTrialCommodityWireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTrialCommodityWireComponent]
    });
    fixture = TestBed.createComponent(FreeTrialCommodityWireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
