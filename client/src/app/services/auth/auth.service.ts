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
import { appConfig } from 'src/app/shared/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) {}

  signUp(user: User): Observable<any> {
    let api = `${appConfig.URL}/register`;
    return this.http.post<any>(api, user);
  }

  signIn(user: User): Observable<any> {
    let api = `${appConfig.URL}/auth`;
    return this.http.post<any>(api, user);
  }

  getUser(id) {
    let api = `${appConfig.URL}/me`;
    return this.http.get<any>(`${api}/${id}`);
  }

  getUserLocations(id) {
    let api = `${appConfig.URL}/location`;
    return this.http.get<any>(`${api}/${id}`);
  }

  addUserLocatin(location) {
    let api = `${appConfig.URL}/location`;
    return this.http.post<any>(api, location);
  }

  changingPass(id, data) {
    let api = `${appConfig.URL}/changePass`;
    return this.http.put(`${api}/${id}`, data);
  }

  inviteUser(data) {
    let api = `${appConfig.URL}/inviteUser`;
    return this.http.post<any>(api, data);
  }

  inviteUserSignup(data) {
    let api = `${appConfig.URL}/register`;
    return this.http.post<any>(api, data);
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
    let api = `${appConfig.URL}/user-profile/${id}`;
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
