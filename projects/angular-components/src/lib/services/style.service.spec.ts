import { TestBed } from '@angular/core/testing';

import { PremuiStyleService } from './style.service';

describe('PremuiStyleService', () => {
  let service: PremuiStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremuiStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
