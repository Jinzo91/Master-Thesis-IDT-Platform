import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyOverviewComponent } from './pages/company-overview/company-overview.component';
import { MaterialModule } from 'src/app/material.module';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {CasesModule} from '../cases/cases.module';


@NgModule({
  declarations: [
    CompanyOverviewComponent,
    CompanyDetailComponent,
    CompanyListComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CompaniesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CasesModule
  ],
  exports: [
    CompanyListComponent
  ],
})
export class CompaniesModule { }
