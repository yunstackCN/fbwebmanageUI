import { TestBed, inject } from '@angular/core/testing';

import { GetcookieService } from './getcookie.service';

describe('GetcookieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetcookieService]
    });
  });

  it('should be created', inject([GetcookieService], (service: GetcookieService) => {
    expect(service).toBeTruthy();
  }));
});
