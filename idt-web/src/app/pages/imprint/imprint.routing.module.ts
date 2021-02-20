
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImprintComponent } from './imprint/imprint.component';

const routes: Routes = [
    {
      path: '',
      component: ImprintComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class ImprintRoutingModule { }
