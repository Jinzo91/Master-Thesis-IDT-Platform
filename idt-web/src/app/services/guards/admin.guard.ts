
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication.service';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  canActivate() {
    // console.log(helper.decodeToken(storedToken));
    if (this.authService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}

