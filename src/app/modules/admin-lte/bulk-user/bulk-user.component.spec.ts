import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUserComponent } from './bulk-user.component';

describe('BulkUserComponent', () => {
  let component: BulkUserComponent;
  let fixture: ComponentFixture<BulkUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUserComponent]
    });
    fixture = TestBed.createComponent(BulkUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
