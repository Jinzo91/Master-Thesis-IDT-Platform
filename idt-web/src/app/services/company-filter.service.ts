import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface CompanyFilters {
  search: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyFilterService {

  readonly EMPTY_FILTER: CompanyFilters = {
    search: ''
  };

  private _filters$ =  new BehaviorSubject<CompanyFilters>(this.EMPTY_FILTER);
  filters$ = this._filters$.asObservable();

  constructor() { }

  updateFilters(filters: CompanyFilters) {
    this._filters$.next(filters);
  }
}
