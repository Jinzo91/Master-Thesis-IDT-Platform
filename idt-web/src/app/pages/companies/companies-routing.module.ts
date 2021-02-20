import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyOverviewComponent } from './pages/company-overview/company-overview.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import { CompanyDetailResolver } from './companies.resolver';
import { CanDeactivateGuard } from 'src/app/services/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: CompanyOverviewComponent
  },
  {
    path: ':id',
    component: CompanyDetailComponent,
    resolve: {
      company: CompanyDetailResolver
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CompanyDetailResolver]
})
export class CompaniesRoutingModule { }
