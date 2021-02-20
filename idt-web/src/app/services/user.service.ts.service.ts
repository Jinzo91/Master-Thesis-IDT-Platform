import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Case } from '../shared/models/case.model';
import { Company } from '../shared/models/company.model';
import { RequestQueryBuilder,  } from '@nestjsx/crud-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getFollowingCompanies(userId: number): Observable<number[]> {
    return this.apiService.get(`${environment.apiBase}/users/${userId}/companies`);
  }

  followCompany(userId: number, compId: number): Observable<number[]> {
    return this.apiService.post<number[]>(`${environment.apiBase}/users/${userId}/companies/${compId}`, null);
  }

  unfollowCompany(userId: number, compId: number): Observable<number[]> {
    return this.apiService.delete<number[]>(`${environment.apiBase}/users/${userId}/companies/${compId}`);
  }

  getPersonalFeed(userId: number): Observable<Case[]> {
    return this.apiService.get(`${environment.apiBase}/users/${userId}/feed`);
  }

  getSuggestedCompanies(userId: number): Observable<Company[]> {
    return this.apiService.get(`${environment.apiBase}/users/${userId}/feed/suggest/company`);
  }

  getSuggestedCases(userId: number): Observable<Case[]> {
    return this.apiService.get(`${environment.apiBase}/users/${userId}/feed/suggest/case`);
  }
}
