import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionInfoComponent } from './subscription-info.component';

describe('SubscriptionInfoComponent', () => {
  let component: SubscriptionInfoComponent;
  let fixture: ComponentFixture<SubscriptionInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionInfoComponent]
    });
    fixture = TestBed.createComponent(SubscriptionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
