import { TestBed, inject } from '@angular/core/testing';

import { CommomService } from './commom.service';

describe('CommomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommomService]
    });
  });

  it('should be created', inject([CommomService], (service: CommomService) => {
    expect(service).toBeTruthy();
  }));
});
