import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css'],
})
export class InviteUserComponent implements OnInit {
  inviteUserForm: FormGroup;
  submitted = false;
  httperrors = '';
  httpmsgs = '';

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.inviteUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get inviteUserFormControls() {
    return this.inviteUserForm.controls;
  }

  InviteUser() {
    let userID = this.authService.getUserID();
    const dataForm = this.inviteUserForm.value;
    dataForm['userID'] = userID;
    this.submitted = true;

    if (this.inviteUserForm.valid) {
      this.authService.inviteUser(this.inviteUserForm.value).subscribe(
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
