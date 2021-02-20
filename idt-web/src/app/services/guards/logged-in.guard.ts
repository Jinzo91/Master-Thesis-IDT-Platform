
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class LoggedInGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate() {

        const storedToken = this.authService.token;
        const isExpired = helper.isTokenExpired(storedToken);
        if (storedToken && !isExpired) {
            this.router.navigate(['/']);
        } else {
            return true;
        }
    }
}
