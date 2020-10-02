import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
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
    public router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get signupFormControls() {
    return this.signupForm.controls;
  }

  onChoseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationChosen = true;
  }

  registerUser() {
    const dataForm = this.signupForm.value;
    dataForm['lat'] = this.lat;
    dataForm['lng'] = this.lng;
    this.submitted = true;

    if (this.signupForm.valid) {
      this.authService.signUp(dataForm).subscribe(
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
