import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationGuard } from 'src/app/services/guards/registration.guard';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    canActivate: [RegistrationGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class RegistrationRoutingModule { }
