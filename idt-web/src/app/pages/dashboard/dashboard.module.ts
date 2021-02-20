// import the new component
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CaseCarouselComponent } from './case-carousel/case-carousel.component';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { CaseCardComponent } from './case-card/case-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    CaseCarouselComponent,
    CaseCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    GoogleChartsModule,
    SharedModule
  ]
})
export class DashboardModule { }
