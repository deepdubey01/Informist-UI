import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManageComponent } from './users-manage.component';

describe('UsersManageComponent', () => {
  let component: UsersManageComponent;
  let fixture: ComponentFixture<UsersManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersManageComponent]
    });
    fixture = TestBed.createComponent(UsersManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
