import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BotComponent } from './bot/bot.component';



const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'bot',
    component: BotComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule { }
