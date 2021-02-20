
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseOverviewComponent } from './pages/case-overview/case-overview.component';
import { CaseDetailComponent } from './pages/case-detail/case-detail.component';
import { CaseDetailResolver } from './cases.resolver';
import { CaseAddComponent } from './pages/case-add/case-add.component';
import { CanDeactivateGuard } from 'src/app/services/guards/can-deactivate.guard';

const routes: Routes = [
    {
      path: '',
      component: CaseOverviewComponent
    },
    {
      path: 'add',
      component: CaseAddComponent
    },
    {
      path: ':id',
      component: CaseDetailComponent,
      canDeactivate: [CanDeactivateGuard],
      resolve: {
        case: CaseDetailResolver
      }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [CaseDetailResolver]
})
export class CasesRoutingModule { }
