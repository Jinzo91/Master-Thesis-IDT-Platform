
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate() {
        const storedToken = this.authService.token;
        const isExpired = helper.isTokenExpired(storedToken);
        console.log(helper.decodeToken(storedToken));
        if (storedToken && !isExpired) {
            return true;
        } else {
            this.router.navigate(['login']);
        }
    }
}
