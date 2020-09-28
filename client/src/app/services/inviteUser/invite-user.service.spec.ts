import { TestBed } from '@angular/core/testing';

import { InviteUserService } from './invite-user.service';

describe('InviteUserService', () => {
  let service: InviteUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
