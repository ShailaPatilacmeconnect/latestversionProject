import { TestBed } from '@angular/core/testing';

import { BasicFunctionService } from './basic-function.service';

describe('BasicFunctionService', () => {
  let service: BasicFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
