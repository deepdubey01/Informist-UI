import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLayout2Component } from './news-layout2.component';

describe('NewsLayout2Component', () => {
  let component: NewsLayout2Component;
  let fixture: ComponentFixture<NewsLayout2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsLayout2Component]
    });
    fixture = TestBed.createComponent(NewsLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
