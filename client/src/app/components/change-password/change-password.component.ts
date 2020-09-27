import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  httperrors = '';
  httpmsgs = '';

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: ActivatedRoute,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get changePasswordFormControls() {
    return this.changePasswordForm.controls;
  }

  changePassword() {
    const id = this.router.snapshot.paramMap.get('id');

    this.submitted = true;
    if (this.changePasswordForm.valid) {
      this.authService
        .changingPass(id, this.changePasswordForm.value)
        .subscribe(
          (res: any) => {
            this.route.navigate([`product-list`]);
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
