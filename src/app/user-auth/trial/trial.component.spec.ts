import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpExample } from './trial.component';

describe('TableHttpExample', () => {
  let component: TableHttpExample;
  let fixture: ComponentFixture<TableHttpExample>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableHttpExample]
    });
    fixture = TestBed.createComponent(TableHttpExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
