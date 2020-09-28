import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserSignupComponent } from './invite-user-signup.component';

describe('InviteUserSignupComponent', () => {
  let component: InviteUserSignupComponent;
  let fixture: ComponentFixture<InviteUserSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteUserSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
