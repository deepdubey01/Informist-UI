import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpackageManageComponent } from './subpackage-manage.component';

describe('SubpackageManageComponent', () => {
  let component: SubpackageManageComponent;
  let fixture: ComponentFixture<SubpackageManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubpackageManageComponent]
    });
    fixture = TestBed.createComponent(SubpackageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
