import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  submitted = false;
  httperrors = '';

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.signinForm = this.fb.group({
      email: ['abokor@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get signinFormControls() {
    return this.signinForm.controls;
  }

  loginUser() {
    this.submitted = true;
    if (this.signinForm.valid) {
      this.authService.signIn(this.signinForm.value).subscribe(
        (res: any) => {
          if (res.loginCount !== 0) {
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('userID', res.id);

            this.router.navigate(['product-list']);
          } else {
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('userID', res.id);
            this.router.navigate([`changePassword/${res.id}`]);
          }
        },
        (errors) => {
          // this.signinForm.reset();
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
