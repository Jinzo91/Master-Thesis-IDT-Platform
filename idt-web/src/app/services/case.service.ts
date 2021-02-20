import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Case, Source, Technology, Comment } from '../shared/models/case.model';
import { map } from 'rxjs/operators';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

export type SortOrder = 'DESC' | 'ASC';

export interface CasesResponse {
  values: Case[];
  count: number;
}

export interface CasesPageResponse {
  data: Case[];
  count: number;
  page: number;
  pageCount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(private apiService: ApiService) { }

  private lastPageNumber = new BehaviorSubject<number>(-1);
  getLastPageNumber(): number {
    return this.lastPageNumber.getValue();
  }
  setLastPageNumber(pageNumber) {
    this.lastPageNumber.next(pageNumber);
  }

  getCases({ search, filter, sort, sortOrder, limit, pageIndex, pageSize}: {
      search?: string,
      filter?: { field: string, value: any[] }[],
      sort?: string, sortOrder?: SortOrder,
      limit?: number,
      pageIndex?: number,
      pageSize?: number
    }): Observable<CasesPageResponse> {

    const defaultSortOrder = 'DESC';
    const defaultSortField = 'createdAt';
    const defaultLimit = 0;
    const defaultPage = 1;

    const query = {
      join: [
        {field: 'company'},
        {field: 'technologies'},
      ],
      search: {$and: []},
      sort: [
        {field: sort || defaultSortField, order: sortOrder || defaultSortOrder}
      ],
      page: pageIndex || defaultPage,
      limit: limit || pageSize || defaultLimit
    };

    // Search term in title and description
    if (search) {
      query.search.$and.push({
        $or: [
          { title: { $cont: search } },
          { description: { $cont: search } },
        ]});
    }

    // Adding filters
    if (filter) {
      query.search.$and.push(this.addFilterCond(filter, 'company', 'company.id'));
      query.search.$and.push(this.addFilterCond(filter, 'caseType', 'caseType'));
      query.search.$and.push(this.addFilterCond(filter, 'technologies', 'technologies.id'));
      query.search.$and.push(this.addFilterCondExclude(filter, 'createdBy', 'createdBy.id'))
      query.search.$and = query.search.$and.filter(element => !!element);
    }
    const queryString = RequestQueryBuilder.create(query).query();
    console.log(queryString);
    return this.apiService.get<CasesPageResponse>(`${environment.apiBase}/cases` + '?' + queryString);
  }

  getUserCases({ search, filter, sort, sortOrder, limit, pageIndex, pageSize, userId}: {
    search?: string,
    filter?: { field: string, value: any[] }[],
    sort?: string, sortOrder?: SortOrder,
    limit?: number,
    pageIndex?: number,
    pageSize?: number,
    userId?: string
  }): Observable<CasesPageResponse> {

    const defaultSortOrder = 'DESC';
    const defaultSortField = 'createdAt';
    const defaultLimit = 0;
    const defaultPage = 1;

    const query = {
      join: [
        {field: 'company'},
        {field: 'technologies'},
      ],
      search: {$and: []},
      sort: [
        {field: sort || defaultSortField, order: sortOrder || defaultSortOrder}
      ],
      page: pageIndex || defaultPage,
      limit: limit || pageSize || defaultLimit
    };

    // Search term in title and description
    if (search) {
      query.search.$and.push({
        $or: [
          { title: { $cont: search } },
          { description: { $cont: search } },
        ]});
    }

    // Adding filters
    if (filter) {
      // query.search.$and.push(this.addFilterCond(filter, 'createdBy', 'createdBy.id'));
      query.search.$and.push(this.addFilterCond(filter, 'company', 'company.id'));
      query.search.$and.push(this.addFilterCond(filter, 'caseType', 'caseType'));
      query.search.$and.push(this.addFilterCond(filter, 'technologies', 'technologies.id'));
      query.search.$and = query.search.$and.filter(element => !!element);
    }
    // URL query needs to be encoded. Decode for clear-text.
    let queryString = RequestQueryBuilder.create(query).query();
    // For testing, change userId (Paul = 1, Bot = 14125) inside the query at attribute "$eq".
    // tslint:disable:max-line-length
    // Decoded URL example query: 's={"$and":[{"$or":[{"createdBy.id":{"$eq":14125}}]}]}&join[0]=company&join[1]=technologies&join[2]=createdBy&limit=100&page=1&sort[0]=createdAt,DESC';
    queryString = queryString.slice(0, 23) + '{"$or":[{"createdBy.id":{"$eq":' + userId + '}}]}' + queryString.slice(23) + '&join[2]=createdBy';
    return this.apiService.get<CasesPageResponse>(`${environment.apiBase}/cases` + '?' + queryString );
  }

  private addFilterCond(filter: any, filterName: string, filterField: string): any {
    const targetFilter = filter.find(element => element.field === filterName);
    if (targetFilter && targetFilter.value && targetFilter.value.length > 0) {
      const filterCondition = { $or: [] };
      targetFilter.value.forEach(value => filterCondition.$or.push({ [filterField]: { $eq: value.id } }));
      return filterCondition;
    }
    return null;
  }

  private addFilterCondExclude(filter: any, filterName: string, filterField: string) {
    const targetFilter = filter.find(element => element.field === filterName);
    if (targetFilter && targetFilter.value && targetFilter.value.length > 0) {
      const filterCondition = { $or: [] };
      targetFilter.value.forEach(value => filterCondition.$or.push({ [filterField]: { $ne: value.id } }));
      return filterCondition;
    }
    return null;
  }

  getFeaturedCases(): Observable<Case[]> {
    return this.apiService.get<CasesResponse>(`${environment.apiBase}/landing/featuredcases`).pipe(map(result => result.values));
  }

  getCase(index: string): Observable<Case> {
    return this.apiService.get<Case>(`${environment.apiBase}/cases/${index}?join=company&join=technologies`);
  }

  updateCase(index: string, caseUpdateData: Partial<Case>): Observable<Case> {
    return this.apiService.patch<Partial<Case>>(`${environment.apiBase}/cases/${index}`, caseUpdateData);
  }

  addCase(caseData: Partial<Case>): Observable<Case>  {
    return this.apiService.post<Case>(`${environment.apiBase}/cases`, caseData);
  }

  deleteCase(caseId: string): Observable<Case>  {
    return this.apiService.delete(`${environment.apiBase}/cases/${caseId}`);
  }

  enableCase(caseId: string): Observable<Case> {
    return this.apiService.patch(`${environment.apiBase}/cases/${caseId}/enable`);
  }

  getImage(caseId: string): string {
    return `${environment.apiBase}/cases/${caseId}/image`;
  }

  updateImage(caseId: string, image: File): Observable<string> {
    const data = new FormData();
    data.append('file', image, image.name);
    return this.apiService.post<string>(`${environment.apiBase}/cases/${caseId}/image`, data);
  }

  getAllTechnologies(): Observable<Technology[]> {
    return this.apiService.get<Technology[]>(`${environment.apiBase}/cases/technologies`)
      .pipe(
        map(technologies => technologies.sort((a: Technology, b: Technology) => a.name.trim().localeCompare(b.name.trim()))),
      );
  }

  addTechnology(caseId: string, technology: Partial<Technology>): Observable<Technology> {
    return this.apiService.post<Technology>(`${environment.apiBase}/cases/${caseId}/technologies/`, technology);
  }

  removeTechnology(caseId: string, technologyId: string): Observable<Technology> {
    return this.apiService.delete<Technology>(`${environment.apiBase}/cases/${caseId}/technologies/${technologyId}`);
  }

  getTechnologies(caseId: string): Observable<Technology[]> {
    return this.apiService.get<Technology[]>(`${environment.apiBase}/cases/${caseId}/technologies/suggestions`);
  }

  getSources(caseId: string): Observable<Source[]> {
    return this.apiService.get<Source[]>(`${environment.apiBase}/cases/${caseId}/sources`);
  }

  addSource(caseId: string, source: Partial<Source>): Observable<Source> {
    return this.apiService.post<Source>(`${environment.apiBase}/cases/${caseId}/sources`, source);
  }

  getSourceFile(caseId: string, sourceId: string): string {
    return `${environment.apiBase}/cases/${caseId}/sources/${sourceId}/file`;
  }

  addSourceFile(caseId: string, sourceId: string, file: File): Observable<Source> {
    const data = new FormData();
    data.append('file', file, file.name);
    return this.apiService.post<Source>(`${environment.apiBase}/cases/${caseId}/sources/${sourceId}/file`, data);
  }

  deleteSourceFile(caseId: string, sourceId: string) {
    return this.apiService.delete<Source>(`${environment.apiBase}/cases/${caseId}/sources/${sourceId}`);
  }

  getComments(caseId: string): Observable<Comment[]> {
    return this.apiService.get<Comment[]>(`${environment.apiBase}/cases/${caseId}/comments`);
  }

  addComment(caseId: string, comment: Partial<Comment>): Observable<Comment> {
    return this.apiService.post<Comment>(`${environment.apiBase}/cases/${caseId}/comments`, comment);
  }

  editComment(caseId: string, comment: Partial<Comment>): Observable<Comment> {
    return this.apiService.patch<Comment>(`${environment.apiBase}/cases/${caseId}/comments/${comment.id}`, comment);
  }

  deleteComment(caseId: string, commentId): Observable<Comment> {
    return this.apiService.delete<Comment>(`${environment.apiBase}/cases/${caseId}/comments/${commentId}`);
  }
}
