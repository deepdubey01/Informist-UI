import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionManageComponent } from './subscription-manage.component';

describe('SubscriptionManageComponent', () => {
  let component: SubscriptionManageComponent;
  let fixture: ComponentFixture<SubscriptionManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionManageComponent]
    });
    fixture = TestBed.createComponent(SubscriptionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
