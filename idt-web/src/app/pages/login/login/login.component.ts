import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'idt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  returnUrl: string;

  public loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: Validators.required
    })
  });


  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.returnUrl = history.state.returnUrl;
  }

  ngOnDestroy() {}

  get emailErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'You must enter a value' :
      this.loginForm.controls.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  get passwordErrorMessage() {
    return this.loginForm.controls.password.hasError('required') ? 'You must enter a password' : '';
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(untilDestroyed(this))
      .subscribe( () => this.router.navigateByUrl(this.returnUrl));
  }

  openForgotPasswordDialog(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
