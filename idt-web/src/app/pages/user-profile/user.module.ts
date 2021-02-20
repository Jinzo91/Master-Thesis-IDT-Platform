import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user.routing.module';
import {ProfileComponent} from './profile/profile.component';
import { BotComponent } from './bot/bot.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {CasesModule} from '../cases/cases.module';

@NgModule({
  declarations: [
    ProfileComponent,
    BotComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    GoogleChartsModule,
    CasesModule
  ]
})
export class UserModule { }

