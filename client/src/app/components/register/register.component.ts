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

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['abokor@gmail.com', [Validators.required, Validators.email]],
    });
  }

  get signupFormControls() {
    return this.signupForm.controls;
  }

  registerUser() {
    this.submitted = true;
    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value).subscribe(
        (res: any) => {
          // this.signupForm.reset();
          this.httpmsgs = res;
        },
        (errors) => {
          // this.signupForm.reset();
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
