import { TestBed } from '@angular/core/testing';

import { SelectedInstrumentService } from './selected-instrument.service';

describe('SelectedInstrumentService', () => {
  let service: SelectedInstrumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedInstrumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
