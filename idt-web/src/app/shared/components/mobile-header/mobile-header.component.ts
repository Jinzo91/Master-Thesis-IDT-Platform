import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToasterComponent } from '../toaster/toaster.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'idt-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit, OnDestroy {

  userLoggedIn$: Observable<boolean>;
  userAdmin: boolean;

  isSearchFilled = false;

  searchForm = this.formBuilder.group({
    query: [''],
  });
  search$ = new Subject();
  menuOpened: boolean = false;

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
      distinctUntilChanged(),
      untilDestroyed(this)
    ).subscribe(
      data => this.router.navigate(['search', { query: data }])
    );
  }

  onSearch() {
    this.search$.next(this.searchForm.controls.query.value);
    this.isSearchFilled = this.searchForm.controls.query.value !== '';
  }

  login() {
    this.toggleMobileMenu();
    const routerStateSnapshot = this.router.routerState.snapshot;
    this.router.navigate(['login'], { state: { returnUrl: routerStateSnapshot.url }});
  }

  logout() {
    this.toggleMobileMenu();
    this.authService.logout();
    setTimeout(() => {
      this.showSnackbar('You just logged out!', 'Close');
    });
  }

  showSnackbar(message: string, action: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'info',
        message
      }
    });
  }

  toggleMobileMenu() {
    this.menuOpened = !this.menuOpened;
    if (this.authService.isAdmin()) {
      this.userAdmin = this.authService.isAdmin();
    }
  }

  goTo(url: string) {
    this.toggleMobileMenu();
    this.router.navigateByUrl(url);
  }

  goToHomepage() {
    this.router.navigateByUrl('/');
  }

  goToProfilePage() {
    this.router.navigateByUrl('/profile');
  }

  ngOnDestroy() {}
 }
