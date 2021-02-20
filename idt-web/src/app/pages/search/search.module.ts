import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { CompaniesModule } from '../companies/companies.module';
import {CasesModule} from '../cases/cases.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    CompaniesModule,
    CasesModule,
    SharedModule,
    MaterialModule
  ]
})
export class SearchModule { }
