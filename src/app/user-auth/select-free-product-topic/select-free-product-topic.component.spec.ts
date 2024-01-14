import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFreeProductTopicComponent } from './select-free-product-topic.component';

describe('SelectFreeProductTopicComponent', () => {
  let component: SelectFreeProductTopicComponent;
  let fixture: ComponentFixture<SelectFreeProductTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectFreeProductTopicComponent]
    });
    fixture = TestBed.createComponent(SelectFreeProductTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
