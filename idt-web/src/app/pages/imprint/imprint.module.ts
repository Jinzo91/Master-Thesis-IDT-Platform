import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint/imprint.component';
import { ImprintRoutingModule } from './imprint.routing.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ImprintComponent],
  imports: [
    CommonModule,
    ImprintRoutingModule,
    MaterialModule
  ]
})
export class ImprintModule { }
