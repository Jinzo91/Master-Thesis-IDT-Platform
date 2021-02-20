import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable, Subject} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLinkActive } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ToasterComponent } from '../toaster/toaster.component';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'idt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userLoggedIn$: Observable<boolean>;
  userAdmin: boolean;
  firstName: string = 'User';

  navLinks = [
    { label: 'Home', path: '' },
    { label: 'Feed', path: 'feed' },
    { label: 'Dashboard', path: 'dashboard' },
    { label: 'Cases', path: 'cases' },
    { label: 'Companies', path: 'companies' },
    { label: 'About IDT', path: 'about' },
  ];

  searchForm = this.formBuilder.group({
    query: [''],
  });
  search$ = new Subject();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.userLoggedIn$ = this.authService.isLoggedIn();
    this.userAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.search$.pipe(
      debounceTime(250),
      untilDestroyed(this)
    ).subscribe(
      data => this.router.navigate(['search', { query: data }])
    );
  }

  onSearch() {
    this.search$.next(this.searchForm.controls.query.value);
  }

  login() {
    const routerStateSnapshot = this.router.routerState.snapshot;
    this.router.navigate(['login'], { state: { returnUrl: routerStateSnapshot.url }});
  }

  logout() {
    this.authService.logout();
    setTimeout(() => {
      this.showSnackbar('You just logged out!', 'Close');
    });
  }

  goToHomepage() {
    this.router.navigateByUrl('/');
  }

  showSnackbar(message: string, action: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'info',
        message
      }
    });
  }

  isLinkActive(isRouterLinkActive: RouterLinkActive, link: string) {
    // handle the home page separately
    if (link.length === 0) {
      return isRouterLinkActive.isActive;
    } else {
      return isRouterLinkActive.isActive || this.router.url.includes(link);
    }
  }

  checkAdmin() {
    if (this.authService.isAdmin()) {
      this.userAdmin = this.authService.isAdmin();
    }
  }

  getUserName() {
    this.firstName = this.authService.user.firstName + ' ' + this.authService.user.lastName;
  }

  goToAdminPage() {
    this.router.navigateByUrl('/admin');
  }

  goToProfilePage() {
    this.router.navigateByUrl('/profile');
  }

  goToBotPage() {
    this.router.navigateByUrl('/profile/bot');
  }

  ngOnDestroy() {}
}
