import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {filter, scan} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {
  constructor(private router: Router) {}

  private _routeHistory$ =  new BehaviorSubject<NavigationEnd[]>([]);
  routeHistory$ = this._routeHistory$.asObservable();

  loadRouting() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        scan((prev, curr) => [...prev, curr], [])
      ).subscribe(value => this._routeHistory$.next(value));
  }
}
