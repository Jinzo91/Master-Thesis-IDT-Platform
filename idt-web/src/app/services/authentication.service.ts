import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegistrationData } from '../shared/models/registration-data.model';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

interface LoginResponse {
  expires_in: number;
  access_token: string;
  user_id: string;
  status: number;
}

const ROLES = {
  0: 'admin',
  1: 'user'
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private apiService: ApiService) { }

  login(mail: string, password: string): Observable<LoginResponse> {

    return this.apiService.post<LoginResponse>(`${environment.apiBase}/auth/login`, { mail, password }).pipe(
      tap(response => {
        window.localStorage.setItem('token', response.access_token);
        this.isLoginSubject.next(true);
      })
    );
  }

  logout() {
    window.localStorage.removeItem('token');
    this.isLoginSubject.next(false);
    // relaod only a particular component in future
    window.location.reload();
  }

  register({ firstName, lastName, password, invitationHash }: RegistrationData): Observable<any> {
    const url = `${environment.apiBase}/signup/invite/${invitationHash}`;
    const body = { firstName, lastName, password };
    return this.apiService.post(url, body).pipe(
      tap(response => {
        console.log(response);
      })
    );
  }

  get token() {
    return window.localStorage.getItem('token') || '';
  }

  hasToken(): boolean {
    return !!this.token;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  get role() {
    if (!this.hasToken()) {
      return 'visitor';
    } else {
      return ROLES[helper.decodeToken(this.token).user.role];
    }
  }

  get user() {
    if (this.token) {
      return helper.decodeToken(this.token).user;
    }
    return null;
  }

  isAdmin() {
    // decode token and check for user role. 0 = admin, 1= user
    const storedToken = this.token;
    const userPayload = helper.decodeToken(storedToken);
    let role;
    if (storedToken) {
      role = userPayload.user.role;
      if (role === 0) {
        return true;
      }
    }
  }
}
