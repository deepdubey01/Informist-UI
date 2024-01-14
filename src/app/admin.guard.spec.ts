import { TestBed } from '@angular/core/testing';
import { CanActivate } from '@angular/router';
import { AdminGuard } from './admin.guard';

describe('adminGuard', () => {
  let guard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
