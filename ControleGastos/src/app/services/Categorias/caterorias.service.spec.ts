import { TestBed } from '@angular/core/testing';

import { CateroriasService } from './caterorias.service';

describe('CateroriasService', () => {
  let service: CateroriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CateroriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
