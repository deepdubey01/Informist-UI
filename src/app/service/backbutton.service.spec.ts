import { TestBed } from '@angular/core/testing';

import { BackbuttonService } from './backbutton.service';

describe('BackbuttonService', () => {
  let service: BackbuttonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackbuttonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
