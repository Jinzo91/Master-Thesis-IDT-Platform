import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionActivateComponent } from './activate/subscription-activate.component'
import { SubscriptionRoutingModule } from './subscription.routing.module';
import { SubscriptionUnsubscribeComponent } from './unsubscribe/subscription-unsubscribe.component';

@NgModule({
  declarations: [
    SubscriptionActivateComponent,
    SubscriptionUnsubscribeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SubscriptionRoutingModule
  ]
})
export class SubscriptionModule { }
