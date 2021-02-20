import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'idt-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {

  public forgotPwdForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>) { }

  close(event) {
    event.preventDefault();
    this.dialogRef.close();
    // TODO: implement error handling when the backend is so far
  }

  onSubmit() {
    // TODO: add a backend call.
  }
}
