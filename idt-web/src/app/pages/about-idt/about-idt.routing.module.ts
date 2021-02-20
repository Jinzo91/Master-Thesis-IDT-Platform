
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutIdtComponent } from './about-idt/about-idt.component';

const routes: Routes = [
    {
      path: '',
      component: AboutIdtComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class AboutIdtRoutingModule { }
