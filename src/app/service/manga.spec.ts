import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from '@jest/globals';

import { MangaService } from './manga';

describe('MangaService', () => {
  let service: MangaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
