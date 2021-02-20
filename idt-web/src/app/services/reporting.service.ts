import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

interface TopTechnologiesResponse {
  id: string;
  name: string;
  count: number;
}

interface CaseTypeDistributionResponse {
  caseType: string;
  count: number;
}

interface TopContributorsResponse {
  user: User;
  resource: string;
  count: number;
}

interface OneContributorResponse {
  user: User;
  resource: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(
    private apiService: ApiService) { }

  getTopTechnologies(): Observable<TopTechnologiesResponse[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/top/technologies`);
  }

  getTopContributors(params?: {currentMonth: boolean}): Observable<TopContributorsResponse[]> {
    const date = new Date();
    let firstDay;
    let lastDay;

    if (params && params.currentMonth) {
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toString();
      lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString();
    } else {
      firstDay = new Date(2017, 0, 1).toString();
      lastDay = date.toString();
    }

    return this.apiService.get(`${environment.apiBase}/reporting/contributors?start=${firstDay}&end=${lastDay}`);
  }

  getTopCompanies(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/top/companies`);
  }

  getCaseTypeDistribution(): Observable<CaseTypeDistributionResponse[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/top/casetypes`);
  }

  getCounts(): Observable<any> {
    return this.apiService.get(`${environment.apiBase}/landing/counts`);
  }

  getProgressCases(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/progress/cases`);
  }

  getProgressCompanies(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/progress/companies`);
  }

  getNewestCompanies(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/newest/companies`);
  }

  getTodaysCaseCount(): Observable<any> {
    return this.apiService.get(`${environment.apiBase}/reporting/today/cases`);
  }

  getTodaysCompanyCount(): Observable<any> {
    return this.apiService.get(`${environment.apiBase}/reporting/today/companies`);
  }

  getTrendingTechnologies(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/trending/technologies`);
  }

  getOneContributor(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/contributors/user`);
  }

  getContributorBot(): Observable<any[]> {
    return this.apiService.get(`${environment.apiBase}/reporting/contributors/bot`);
  }
}
