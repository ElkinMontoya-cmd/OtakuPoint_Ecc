import { TestBed } from '@angular/core/testing';

import { OverlayHistory } from './overlay-history';

describe('OverlayHistory', () => {
  let service: OverlayHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
