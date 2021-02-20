import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const jwtHelper = new JwtHelperService();

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isTokenExpired = jwtHelper.isTokenExpired(this.authService.token);

    // user logged in and token expired
    if (this.authService.hasToken() && isTokenExpired) {
      this.authService.logout();
      this.router.navigateByUrl('/login');
      return next.handle(request);
    } else if (this.authService.hasToken() && !isTokenExpired) {
      // token valid => add authorization header with jwt token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.authService.token
        }
      });

      return next.handle(request);

    } else {
      // no token => visitor or logged out. no action needed.
      return next.handle(request);
    }
  }
}
