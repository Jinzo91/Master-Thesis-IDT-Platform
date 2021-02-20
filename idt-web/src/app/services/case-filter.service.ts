import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Technology, CaseType } from '../shared/models/case.model';
import { Company } from '../shared/models/company.model';

export interface CaseFilters {
  search: string;
  caseTypes: CaseType[];
  companies: Company[];
  technologies: Technology[];
}

@Injectable({
  providedIn: 'root'
})
export class CaseFilterService {

  readonly EMPTY_FILTER: CaseFilters = {
    search: '',
    caseTypes: [],
    companies: [],
    technologies: [],
  };

  private _filters$ =  new BehaviorSubject<CaseFilters>(this.EMPTY_FILTER);
  filters$ = this._filters$.asObservable();

  constructor() { }

  updateFilters(filters: CaseFilters) {
    this._filters$.next(filters);
  }
}
