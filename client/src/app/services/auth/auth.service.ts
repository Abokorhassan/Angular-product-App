import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'http://localhost:3900/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) {}

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/register`;
    return this.http.post<any>(api, user);
  }

  // Sign-in
  signIn(user: User): Observable<any> {
    let api = `${this.endpoint}/auth`;
    return this.http.post<any>(api, user);
  }

  changingPass(id, data) {
    let api = `${this.endpoint}/changePass`;
    return this.http.put(`${api}/${id}`, data);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getUserID() {
    return localStorage.getItem('userID');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');

    if (removeToken == null) {
      localStorage.removeItem('userID');
      this.router.navigate(['login']);
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
