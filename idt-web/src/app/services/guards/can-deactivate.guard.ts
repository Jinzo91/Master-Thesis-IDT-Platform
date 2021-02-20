import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CaseDetailComponent } from 'src/app/pages/cases/pages/case-detail/case-detail.component';
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent> {

    canDeactivate(component: CaseDetailComponent) {
        return component.canDeactivate ? component.canDeactivate() : true;
      }
}