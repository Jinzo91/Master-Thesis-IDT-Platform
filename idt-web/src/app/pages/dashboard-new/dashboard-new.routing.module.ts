import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardNewComponent } from './dashboard-new.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardNewComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashboardNewRoutingModule { }
