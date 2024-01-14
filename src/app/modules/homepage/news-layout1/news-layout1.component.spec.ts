import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLayout1Component } from './news-layout1.component';

describe('NewsLayout1Component', () => {
  let component: NewsLayout1Component;
  let fixture: ComponentFixture<NewsLayout1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsLayout1Component]
    });
    fixture = TestBed.createComponent(NewsLayout1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
