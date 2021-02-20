import { Injectable } from '@angular/core';
import { Company } from '../shared/models/company.model';
import { Case } from '../shared/models/case.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface GetSearchDataResponse {
  companies: Company[];
  cases: Case[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private apiService: ApiService) { }

  getSearchData(query?: string): Observable<GetSearchDataResponse> {
    let url = `${environment.apiBase}/search`;
    if (query) {
      url += `?query=${query}`;
    }
    return this.apiService.get<GetSearchDataResponse>(url);
  }
}
