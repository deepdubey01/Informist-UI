import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubpackageComponent } from './add-subpackage.component';

describe('AddSubpackageComponent', () => {
  let component: AddSubpackageComponent;
  let fixture: ComponentFixture<AddSubpackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubpackageComponent]
    });
    fixture = TestBed.createComponent(AddSubpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
