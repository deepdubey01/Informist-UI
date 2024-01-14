import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageManageComponent } from './package-manage.component';

describe('PackageManageComponent', () => {
  let component: PackageManageComponent;
  let fixture: ComponentFixture<PackageManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageManageComponent]
    });
    fixture = TestBed.createComponent(PackageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
