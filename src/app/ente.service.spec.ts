import { TestBed, inject } from '@angular/core/testing';

import { EnteService } from './ente.service';

describe('EnteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnteService]
    });
  });

  it('should be created', inject([EnteService], (service: EnteService) => {
    expect(service).toBeTruthy();
  }));
});
