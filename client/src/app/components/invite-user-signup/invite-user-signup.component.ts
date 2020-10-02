import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-invite-user-signup',
  templateUrl: './invite-user-signup.component.html',
  styleUrls: ['./invite-user-signup.component.css'],
})
export class InviteUserSignupComponent implements OnInit {
  inviteUserSignupForm: FormGroup;
  submitted = false;

  httperrors = '';
  httpmsgs = '';

  // google maps zoom level
  zoom: number = 14;

  // initial center position for the map
  DefaultLatitude: number = 9.561634416772648;
  DefaultLongitude: number = 44.063075575307266;

  lat: number;
  lng: number;
  locationChosen = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: ActivatedRoute,
    public route: Router
  ) {}

  ngOnInit() {
    this.inviteUserSignupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onChoseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationChosen = true;
  }

  get inviteUserSignupFormControls() {
    return this.inviteUserSignupForm.controls;
  }

  registerUser() {
    let InvitedUser = this.router.snapshot.paramMap.get('id');
    const dataForm = this.inviteUserSignupForm.value;
    dataForm['lat'] = this.lat;
    dataForm['lng'] = this.lng;
    dataForm['InvitedUser'] = InvitedUser;
    this.submitted = true;

    if (this.inviteUserSignupForm.valid) {
      this.authService.inviteUserSignup(dataForm).subscribe(
        (res: any) => {
          this.httpmsgs = res;
        },
        (errors) => {
          if (errors.status === 400) {
            this.httperrors = errors.error;
          } else {
            this.httperrors = 'Some thing went wrong!';
          }
        }
      );
    }
  }
}
