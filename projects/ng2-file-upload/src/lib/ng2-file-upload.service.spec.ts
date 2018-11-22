import { TestBed } from '@angular/core/testing';

import { Ng2FileUploadService } from './ng2-file-upload.service';

describe('Ng2FileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Ng2FileUploadService = TestBed.get(Ng2FileUploadService);
    expect(service).toBeTruthy();
  });
});
