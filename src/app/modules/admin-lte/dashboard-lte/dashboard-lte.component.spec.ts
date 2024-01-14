import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLteComponent } from './dashboard-lte.component';

describe('DashboardLteComponent', () => {
  let component: DashboardLteComponent;
  let fixture: ComponentFixture<DashboardLteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLteComponent]
    });
    fixture = TestBed.createComponent(DashboardLteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
