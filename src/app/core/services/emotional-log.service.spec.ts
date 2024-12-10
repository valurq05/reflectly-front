import { TestBed } from '@angular/core/testing';

import { EmotionalLogService } from './emotional-log.service';

describe('EmotionalLogService', () => {
  let service: EmotionalLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionalLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
