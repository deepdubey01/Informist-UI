import { TestBed } from '@angular/core/testing';

import { ContextMenuService } from './context-service.service';

describe('ContextServiceService', () => {
  let service: ContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
