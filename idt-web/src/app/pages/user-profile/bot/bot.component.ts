import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject, Observable, throwError, EMPTY, BehaviorSubject, combineLatest, ReplaySubject} from 'rxjs';
import {AuthenticationService} from '../../../services/authentication.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { ReportingService } from 'src/app/services/reporting.service';
import {catchError, distinctUntilChanged, filter, map, startWith, tap, withLatestFrom} from 'rxjs/operators';
import {CaseService, SortOrder} from '../../../services/case.service';
import {dynamicSearch} from '../../../shared/operators/dynamic-search';
import {ToasterComponent} from '../../../shared/components/toaster/toaster.component';
import {CaseFilterService} from '../../../services/case-filter.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {CompaniesPageResponse, CompanyService} from '../../../services/company.service';
import {Company} from '../../../shared/models/company.model';

interface SortChange {
  sort: string;
  sortOrder: SortOrder;
}

@Component({
  selector: 'idt-app-user',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit, OnDestroy {

  private _destroyed: Subject<void> = new Subject();
  private caseFilters$ = this.caseFilterService.filters$;

  currentPage$ = new BehaviorSubject(0);
  currentPageSize$ = new BehaviorSubject(10);
  currentSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

  searchString$: Observable<string>;
  filterForm = this.formBuilder.group({
    search: '',
    caseTypes: [],
    companies: [],
    technologies: [],
  });
  companyFilteringCtrl: FormControl = new FormControl();
  filteredServerSideCompanies$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  isSearchingForCompanies: boolean = false;

  helper = new JwtHelperService();
  emailValue: string = '';
  firstName: string = 'User';
  lastName: string = '';
  fullName: string = 'User Profile';
  role: object;

  oneContributor: any[];


  cases$ = combineLatest(
    this.caseFilters$.pipe(distinctUntilChanged()),
    this.currentPage$.pipe(distinctUntilChanged()),
    this.currentPageSize$.pipe(distinctUntilChanged()),
    this.currentSort$.pipe(distinctUntilChanged()),
  ).pipe(
    map(([filters, page, pageSize, sortObject]) => ({ filters, page, pageSize, sortObject })),
    dynamicSearch((params) =>
      this.caseService.getUserCases({
        // Bot ID = 14125
        userId: '14125',
        search: params.filters.search,
        pageIndex: params.page,
        pageSize: params.pageSize,
        sort: params.sortObject.sort,
        sortOrder: params.sortObject.sortOrder,
        filter: [
          { field: 'company', value: params.filters.companies },
          { field: 'caseType', value: params.filters.caseTypes },
          { field: 'technologies', value: params.filters.technologies }
        ]
      }).pipe(
        tap( x => console.log(x)),
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
    ),
  );

  constructor(
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private reportingService: ReportingService,
    private snackBar: MatSnackBar,
    private caseFilterService: CaseFilterService,
    private caseService: CaseService,
  ) { }

  getUserInfo() {
    this.emailValue = this.authService.user.mail;
    this.firstName = this.authService.user.firstName;
    this.lastName = this.authService.user.lastName;
    this.fullName = this.authService.user.firstName + ' ' + this.authService.user.lastName;
    this.role = this.authService.role;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.reportingService.getContributorBot().subscribe(data => this.oneContributor = data);

    this.caseFilters$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.currentPage$.next(1));

    this.searchString$ = this.filterForm.controls.search.valueChanges;
  }
}
