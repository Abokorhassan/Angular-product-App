import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  httperrors = '';
  httpmsgs = '';

  userData: User;
  userLocations = [];

  // google maps zoom level
  zoom: number = 12;

  // initial center position for the map
  DefaultLatitude: number = 9.561634416772648;
  DefaultLongitude: number = 44.063075575307266;

  latForm: number;
  lngForm: number;
  locationChosen = false;

  locationForm: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    this.getUser(id);
    this.getUserLocations(id);

    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get locationFormControls() {
    return this.locationForm.controls;
  }

  onChoseLocation(event) {
    this.latForm = event.coords.lat;
    this.lngForm = event.coords.lng;
    this.locationChosen = true;
  }

  getUser(id) {
    if (id) {
      this.authService.getUser(id).subscribe(
        (res: any) => {
          this.userData = res;
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

  getUserLocations(id) {
    if (id) {
      this.authService.getUserLocations(id).subscribe(
        (res: any) => {
          this.userLocations = res;
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

  addLocation() {
    const userID = this.authService.getUserID();
    const dataForm = this.locationForm.value;
    dataForm['lat'] = this.latForm;
    dataForm['lng'] = this.lngForm;
    dataForm['userID'] = userID;
    this.submitted = true;

    if (this.locationForm.valid) {
      this.authService.addUserLocatin(dataForm).subscribe(
        (res: any) => {
          this.httpmsgs = res;
          location.reload();
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
