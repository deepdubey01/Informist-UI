import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicItemComponent } from './subtopic-item.component';

describe('SubtopicItemComponent', () => {
  let component: SubtopicItemComponent;
  let fixture: ComponentFixture<SubtopicItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubtopicItemComponent]
    });
    fixture = TestBed.createComponent(SubtopicItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
