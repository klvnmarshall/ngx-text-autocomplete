import { TestBed } from '@angular/core/testing';

import { NgxInputAutocompleteService } from './ngx-input-autocomplete.service';

describe('NgxInputAutocompleteService', () => {
  let service: NgxInputAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxInputAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
