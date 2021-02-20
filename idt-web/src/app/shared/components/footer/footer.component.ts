import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToasterComponent } from '../toaster/toaster.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'idt-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnDestroy {

  emailValue = '';
  isLoading = false;
  userLoggedIn$: Observable<boolean>;

  constructor(
    private subscriberService: SubscriberService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
    ) {
      this.userLoggedIn$ = this.authService.isLoggedIn();
    }

  subscribe() {
    this.isLoading = true;
    this.subscriberService.add(this.emailValue).pipe(
      finalize(() => {
        this.emailValue = '';
        this.isLoading = false;
      }),
      untilDestroyed(this)
    ).subscribe(
      _ => this.showSnackbar(
        'You were added to our subscription list. Please activate your subscription as described in our welcome email.', 'success'),
      _ => this.showSnackbar('An error occured on trying to add you to our subscription list.', 'error'));
  }

  goTo(routerLink: string) {
    this.router.navigateByUrl(routerLink);
  }

  private showSnackbar(message: string, type: string, action?: string, ) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  login() {
    const routerStateSnapshot = this.router.routerState.snapshot;
    this.router.navigate(['login'], { state: { returnUrl: routerStateSnapshot.url }});
  }

  logout() {
    this.authService.logout();
    setTimeout(() => {
      this.showSnackbar('You just logged out!', 'info');
    });
  }

  ngOnDestroy() {}
}
