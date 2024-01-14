import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPreferenceComponent } from './menu-preference.component';

describe('MenuPreferenceComponent', () => {
  let component: MenuPreferenceComponent;
  let fixture: ComponentFixture<MenuPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuPreferenceComponent]
    });
    fixture = TestBed.createComponent(MenuPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
