import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutIdtComponent } from './about-idt/about-idt.component';
import { AboutIdtRoutingModule } from './about-idt.routing.module';

@NgModule({
  declarations: [AboutIdtComponent],
  imports: [
    CommonModule,
    AboutIdtRoutingModule
  ]
})
export class AboutIdtModule { }
