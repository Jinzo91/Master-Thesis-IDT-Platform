import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CaseService } from 'src/app/services/case.service';
import { Case } from 'src/app/shared/models/case.model';

@Injectable()
export class CaseDetailResolver implements Resolve<Case> {

  constructor(private caseService: CaseService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.caseService.getCase(route.params.id);
  }
}
