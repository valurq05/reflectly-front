import { TestBed } from '@angular/core/testing';

import { CategoriesEntryService } from './categories-entry.service';

describe('CategoriesEntryService', () => {
  let service: CategoriesEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
