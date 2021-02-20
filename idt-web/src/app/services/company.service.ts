import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company, Industries, SourceCompany } from '../shared/models/company.model';
import {Case} from '../shared/models/case.model';
import { SortOrder } from './case.service';
import { RequestQueryBuilder, CondOperator } from '@nestjsx/crud-request';

export interface GetCompaniesResponse {
  values: Company[];
  count: string;
}

export interface CompaniesPageResponse {
  data: Company[];
  count: number;
  page: number;
  pageCount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) { }

  searchSourceCompanyByName(name: string) {
    let test = this.apiService.get<SourceCompany[]>(`${environment.apiBase}/companies/findAddableByName/${name}`);
    return test;
  }

  searchSourceCompanyByUrl(url: string) {
    return this.apiService.get<SourceCompany[]>(`${environment.apiBase}/companies/findAddableByURL/${url}`); 
  }

  getCompanies({ search, sort, sortOrder, limit, pageIndex, pageSize}:
    // tslint:disable-next-line:max-line-length
    { search?: string, sort?: string, sortOrder?: SortOrder, limit?: number, pageIndex?: number, pageSize?: number }): Observable<CompaniesPageResponse> {
    const defaultSortOrder = 'ASC';
    const defaultSortField = 'name';
    const defaultLimit = 0;
    const defaultPage = 1;

    let queryString = RequestQueryBuilder
      .create()
      .sortBy({ field: sort || defaultSortField, order: sortOrder || defaultSortOrder })
      .setLimit(limit || pageSize || defaultLimit)
      .setPage(pageIndex || defaultPage)
      .query();

    if (search) {
      queryString = RequestQueryBuilder
        .create()
        // TODO:  add more filters in future (industry, description??)
        .setFilter({ field: 'name', operator: CondOperator.CONTAINS, value: search})
        .sortBy({ field: sort || defaultSortField, order: sortOrder || defaultSortOrder })
        .setLimit(limit || pageSize || defaultLimit)
        .setPage(pageIndex || defaultPage)
        .query();
    }

    return this.apiService.get<CompaniesPageResponse>(`${environment.apiBase}/companies` + '?' + queryString);
  }

  getCompany(idCompany: string): Observable<Company> {
    return this.apiService.get<Company>(`${environment.apiBase}/companies/${idCompany}`);
  }

  updateCompany(company: Partial<Company>, idCompany: string): Observable<any> {
    return this.apiService.patch(`${environment.apiBase}/companies/${idCompany}`, company);
  }

  addCompany(
    { name, headcount, website, industry, headoffice, description, revenue, companySourceId, disabled }: Partial<Company>
    ): Observable<Company>  {
    let industryCode = industry == null ? null : Industries.find(element => element.name === industry).value;
    const body = { name, headcount, website, industry: industryCode, headoffice, description, revenue, companySourceId, disabled };
    return this.apiService.post<Company>(`${environment.apiBase}/companies`, body);
  }

  deleteCompany(companyId: string): Observable<Case>  {
    return this.apiService.delete(`${environment.apiBase}/companies/${companyId}`);
  }

  enableCompany(companyId: string): Observable<Case>  {
    return this.apiService.patch(`${environment.apiBase}/companies/${companyId}/enable`);
  }

  getLogo(idCompany: string): string {
    return `${environment.apiBase}/companies/${idCompany}/logo`;
  }

  updateLogo(idCompany: string, logo: File): Observable<string> {
    const data = new FormData();
    data.append('file', logo, logo.name);
    return this.apiService.post<string>(`${environment.apiBase}/companies/${idCompany}/logo`, data);
  }
}
