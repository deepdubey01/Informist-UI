import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayManageComponent } from './delay-manage.component';

describe('DelayManageComponent', () => {
  let component: DelayManageComponent;
  let fixture: ComponentFixture<DelayManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelayManageComponent]
    });
    fixture = TestBed.createComponent(DelayManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
