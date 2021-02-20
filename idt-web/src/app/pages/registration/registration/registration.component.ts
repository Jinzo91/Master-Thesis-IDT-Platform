import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../../services/authentication.service';
import { passwordMatchValidator } from './../../../services/validators/password.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'idt-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnDestroy {

  loginUrl = '/login';

  public registrationForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      validators: Validators.required
    }),
    passwordRepeat: new FormControl('', {
      validators: [Validators.required]
    })
  }, { validators: [passwordMatchValidator] });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    const invitationHash = this.activatedRoute.snapshot.params.hash;

    this.authService.register({
      firstName: this.registrationForm.controls.firstName.value,
      lastName: this.registrationForm.controls.lastName.value,
      password: this.registrationForm.controls.password.value,
      invitationHash,
    })
    .pipe(untilDestroyed(this))
    .subscribe(
        () => {
          this.router.navigate([this.loginUrl]);
        },
        error => {
          this.showErrorSnackbar('Sorry, we could not register you!', 'Close');
          console.error('Something bad happened!', error);
        }
      );
  }

  get firstNameErrorMessage() {
    return this.registrationForm.controls.firstName.hasError('required') ? 'You must enter a name' : '';
  }

  get lastNameErrorMessage() {
    return this.registrationForm.controls.lastName.hasError('required') ? 'You must enter a name' : '';
  }

  get passwordErrorMessage() {
    return this.registrationForm.controls.password.hasError('required') ? 'You must enter a password' : '';
  }

  get passwordRepeatErrorMessage() {
    return this.registrationForm.controls.passwordRepeat.hasError('required') ? 'You must enter a password' : '';
  }

  get passwordMismatchErrorMessage() {
    return this.registrationForm.hasError('passwordMismatch')
      && this.registrationForm.controls.password.touched
      && this.registrationForm.controls.passwordRepeat.touched
      ? 'The passwords don\'t match!' : '';
  }

  showErrorSnackbar(message: string, action: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'error',
        message
      }
    });
  }

  ngOnDestroy() {}
}
