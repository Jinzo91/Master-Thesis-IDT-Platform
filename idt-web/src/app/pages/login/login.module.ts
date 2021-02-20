import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing.module';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  entryComponents: [ForgotPasswordDialogComponent]
})
export class LoginModule { }
