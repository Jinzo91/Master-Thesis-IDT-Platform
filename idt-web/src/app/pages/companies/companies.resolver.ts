import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/shared/models/company.model';

@Injectable()
export class CompanyDetailResolver implements Resolve<Company> {

  constructor(private companyService: CompanyService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.companyService.getCompany(route.params.id);
  }
}
