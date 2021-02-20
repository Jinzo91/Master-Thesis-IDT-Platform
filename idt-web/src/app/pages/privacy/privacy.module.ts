import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PrivacyComponent } from './privacy/privacy.component';
import { PrivacyRoutingModule } from './privacy.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    PrivacyRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class PrivacyModule { }