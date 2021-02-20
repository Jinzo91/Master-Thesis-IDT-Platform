
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionActivateComponent } from './activate/subscription-activate.component';
import { SubscriptionUnsubscribeComponent } from './unsubscribe/subscription-unsubscribe.component';

const routes: Routes = [
  {
    path: 'activate/:hash',
    component: SubscriptionActivateComponent
  },
  {
    path: 'unsubscribe/:hash',
    component: SubscriptionUnsubscribeComponent
  },
  {
    path: '**',
    redirectTo: 'activate'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SubscriptionRoutingModule { }
