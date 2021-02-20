import {Component, OnDestroy, OnInit} from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import {catchError, switchMap, pluck, map, startWith, distinctUntilChanged, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, EMPTY, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { ToasterComponent } from '../../../shared/components/toaster/toaster.component';
import { MatSnackBar } from '@angular/material';
import {CaseService, CasesPageResponse, SortOrder} from '../../../services/case.service';
import {CompaniesPageResponse, CompanyService} from '../../../services/company.service';
import {dynamicSearch} from '../../../shared/operators/dynamic-search';
import {CaseFilterService} from '../../../services/case-filter.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {CompanyFilterService} from '../../../services/company-filter.service';

interface SortChange {
  sort: string;
  sortOrder: SortOrder;
}

@Component({
  selector: 'idt-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  urlParams$ = this.activatedRoute.params;

  companyResults$: Observable<CompaniesPageResponse>;
  caseResults$: Observable<CasesPageResponse>;

  searchString$ = new Observable<string>();

  caseCurrentPage$ = new BehaviorSubject(0);
  caseCurrentPageSize$ = new BehaviorSubject(25);
  caseCurrentSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

  companyCurrentPage$ = new BehaviorSubject(0);
  companyCurrentPageSize$ = new BehaviorSubject(25);
  companyCurrentSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

  constructor(
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private caseService: CaseService,
    private companyService: CompanyService,
    private caseFilterService: CaseFilterService,
    private companyFilterService: CompanyFilterService,
    private router: Router,
  ) { }

  ngOnInit() {
    // TODO: Normal functionality disabled until we decide what to do with pagination
    /*const searchResults$ = this.route.params.pipe(
      switchMap(routeParams => this.searchService.getSearchData(routeParams.query)),
      catchError(error => {
        this.snackBar.openFromComponent(ToasterComponent, {
          data: {
            type: 'error',
            message: error.message
          }
        });
        return EMPTY;
      }),
    );

    this.caseResults$ = searchResults$.pipe(
      pluck('cases'),
      map(data => ({
        data,
        count: 25,
        page: 1,
        pageCount: 1,
        total: data.length
      })),
    );

    this.companyResults$ = searchResults$.pipe(
      pluck('companies'),
      map(data => ({
        data,
        count: 25,
        page: 1,
        pageCount: 1,
        total: data.length
      })),
    );*/

    this.searchString$ = this.urlParams$.pipe(
      map(params => params.query),
    );

    this.caseResults$  = this.urlParams$.pipe(
      urlParams => combineLatest(
        urlParams,
        this.caseCurrentPage$.pipe(distinctUntilChanged()),
        this.caseCurrentPageSize$.pipe(distinctUntilChanged()),
        this.caseCurrentSort$.pipe(distinctUntilChanged())
      ),
      map(([urlParams, page, pageSize, sortObject]) => ({ urlParams, page, pageSize, sortObject })),
      dynamicSearch(params =>
        this.caseService.getCases({
          search: params.urlParams.query,
          pageIndex: params.page,
          pageSize: params.pageSize,
          sort: params.sortObject.sort,
          sortOrder: params.sortObject.sortOrder
        }).pipe(
          catchError(error => {
            this.snackBar.openFromComponent(ToasterComponent, {
              data: {
                type: 'error',
                message: error.message
              }
            });
            return EMPTY;
          }),
        )
      )
    );

    this.companyResults$  = this.urlParams$.pipe(
      urlParams => combineLatest(
        urlParams,
        this.companyCurrentPage$.pipe(distinctUntilChanged()),
        this.companyCurrentPageSize$.pipe(distinctUntilChanged()),
        this.companyCurrentSort$.pipe(distinctUntilChanged())
      ),
      map(([urlParams, page, pageSize, sortObject]) => ({ urlParams, page, pageSize, sortObject })),
      dynamicSearch(params =>
        this.companyService.getCompanies({
          search: params.urlParams.query,
          pageIndex: params.page,
          pageSize: params.pageSize,
          sort: params.sortObject.sort,
          sortOrder: params.sortObject.sortOrder
        }).pipe(
          catchError(error => {
            this.snackBar.openFromComponent(ToasterComponent, {
              data: {
                type: 'error',
                message: error.message
              }
            });
            return EMPTY;
          }),
        )
      )
    );
  }

  ngOnDestroy() {}

  goToCases() {
    this.urlParams$
      .pipe(
        untilDestroyed(this)
      ).subscribe( value => {
        this.caseFilterService.updateFilters({
          search: value.query,
          caseTypes: [],
          companies: [],
          technologies: []
        });
      });
    this.router.navigateByUrl('/cases');
  }

  goToCompanies() {
    this.urlParams$
      .pipe(
        untilDestroyed(this)
      ).subscribe( value => {
      this.companyFilterService.updateFilters({
        search: value.query
      });
    });
    this.router.navigateByUrl('/companies');
  }
}
