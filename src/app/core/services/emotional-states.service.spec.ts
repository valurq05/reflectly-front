import { TestBed } from '@angular/core/testing';

import { EmotionalStatesService } from './emotional-states.service';

describe('EmotionalStatesService', () => {
  let service: EmotionalStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionalStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
