
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, mapTo } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Guard that checks whether the invitation hash is valid. */
@Injectable({ providedIn: 'root' })
export class RegistrationGuard implements CanActivate {

    constructor(
        private router: Router,
        private apiService: ApiService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const hash = route.params.hash;
        const url = `${environment.apiBase}/signup/invite/${hash}`;
        return this.apiService.get(url).pipe(
            mapTo(true),
            catchError(() => of(this.router.parseUrl('login'))),
        );
    }
}
