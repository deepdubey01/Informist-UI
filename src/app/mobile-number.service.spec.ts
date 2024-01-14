import { TestBed } from '@angular/core/testing';

import { MobileNumberService } from './mobile-number.service';

describe('MobileNumberService', () => {
  let service: MobileNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
