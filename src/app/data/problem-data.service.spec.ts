import { TestBed } from '@angular/core/testing';

import { ProblemDataService } from './problem-data.service';

describe('ProblemDataService', () => {
  let service: ProblemDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProblemDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
