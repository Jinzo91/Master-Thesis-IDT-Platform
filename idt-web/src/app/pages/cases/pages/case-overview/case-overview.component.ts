import { SortOrder } from '../../../../services/case.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { dynamicSearch } from '../../../../shared/operators/dynamic-search';
import { CompanyService, CompaniesPageResponse } from 'src/app/services/company.service';
import { CASE_TYPES, Technology } from 'src/app/shared/models/case.model';
import { Company } from 'src/app/shared/models/company.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RoutingStateService } from '../../../../services/routing-state.service';
import { CaseFilterService, CaseFilters } from '../../../../services/case-filter.service';
import { ReportingService } from 'src/app/services/reporting.service';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, EMPTY } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  catchError,
  take,
  startWith,
  filter,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { CreateCaseComponent } from '../../components/create-case-dialog/create-case-dialog.component';

interface SortChange {
  sort: string;
  sortOrder: SortOrder;
}

@Component({
  selector: 'idt-case-overview',
  styleUrls: ['case-overview.component.scss'],
  templateUrl: 'case-overview.component.html'
})
export class CaseOverviewComponent implements OnInit, OnDestroy {
  private caseFilters$ = this.caseFilterService.filters$;
  userRole: string;

  caseTypes = CASE_TYPES;
  companies$: Observable<Partial<Company>[]>;
  allTechnologies$: Technology[];

  searchString$: Observable<string>;

  currentPage$ = new BehaviorSubject(0);
  currentPageSize$ = new BehaviorSubject(10);
  currentSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

   filterForm = this.formBuilder.group({
     search: '',
     caseTypes: [],
     companies: [],
     technologies: [],
   });


  companyFilteringCtrl: FormControl = new FormControl();
  filteredServerSideCompanies$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  isSearchingForCompanies: boolean = false;

  technologiesFilteringCtrl: FormControl = new FormControl();
  isSearchingForTechnologies: boolean = false;

  routeHistory$ = this.routingStateService.routeHistory$;

  cases$ = combineLatest(
    this.caseFilters$.pipe(distinctUntilChanged()),
    this.currentPage$.pipe(distinctUntilChanged()),
    this.currentPageSize$.pipe(distinctUntilChanged()),
    this.currentSort$.pipe(distinctUntilChanged()),
  ).pipe(
    map(([filters, page, pageSize, sortObject]) => ({ filters, page, pageSize, sortObject })),
    dynamicSearch((params) =>
      this.caseService.getCases({
        search: params.filters.search,
        pageIndex: params.page,
        pageSize: params.pageSize,
        sort: params.sortObject.sort,
        sortOrder: params.sortObject.sortOrder,
        filter: [
          { field: 'company', value: params.filters.companies },
          { field: 'caseType', value: params.filters.caseTypes },
          { field: 'technologies', value: params.filters.technologies },
          { field: 'createdBy', value: [{id: 14125}] }
        ]
      }).pipe(
        tap( x => console.log(x.data)),
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

  optionsTechChart = {
    colors: ['#a8cdff'],
    legend: 'bottom',
    height: 300,
    width: 800,
    chartArea: {
      top: 25,
      left: 280,
      right: 10
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };

  optionsCompanyChart = {
    colors: ['#a8cdff'],
    legend: 'bottom',
    height: 300,
    width: 800,
    chartArea: {
      top: 25,
      left: 60,
      right: 10
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };

  topTechnologies: (string | number)[][];
  topCompanies: (string | number)[][];
  topContributors: (string | number)[][];
  topContributorsMonth: (string | number)[][];

  columnNamesTech = ['Company', 'Number of cases'];
  columnNamesTopCompanies = ['Company', 'Number of cases'];
  columnNamesTopContributors = ['Contributor', 'Number of cases'];

  appliedCompanyFilters = [];
  appliedTechnologyFilters = [];

  constructor(
    private caseService: CaseService,
    private companyService: CompanyService,
    private authService: AuthenticationService,
    private reportingService: ReportingService,
    private snackBar: MatSnackBar,
    private caseFilterService: CaseFilterService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private routingStateService: RoutingStateService,
  ) { }

  ngOnInit() {

    this.caseService.getAllTechnologies().toPromise().then(allTechnologies$ => this.allTechnologies$ = allTechnologies$);

    this.userRole = this.authService.role;

    this.routeHistory$
      .pipe(
        take(1),
        // Getting the last app page url visited
        map(values => values[values.length - 2] || { url: '/' }),
        map(route => route.url.split('/')[1]),
        withLatestFrom(this.caseFilters$),
        map(([lastRoute, filters]) => {
          if (lastRoute === 'cases' || lastRoute.includes('search') || !lastRoute) {
            return filters;
          }
          return this.caseFilterService.EMPTY_FILTER;
        })
      ).subscribe( value => {
        this.caseFilterService.updateFilters(value as CaseFilters);
        this.appliedCompanyFilters = [...this.appliedCompanyFilters, ...value.companies];
        this.filterForm.patchValue(value);
      });

    // Restarting page number when modifying filters
    this.caseFilters$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.currentPage$.next(1));

    this.searchString$ = this.filterForm.controls.search.valueChanges;

    this.filterForm.valueChanges
      .pipe(
        tap(value => this.appliedCompanyFilters = value.companies),
        withLatestFrom(this.filteredServerSideCompanies$.pipe(startWith([]))),
        map(([filterFormValue, filteredCompanies]) => {
          // prevent showing companies twice in the dropdown; must be done because of a bug in the ngx-search component
          const newValues = filteredCompanies.filter(company => !this.isCompanyInAppliedFilter(company));
          this.filteredServerSideCompanies$.next(newValues);
          return filterFormValue;
        }),
        untilDestroyed(this)
      ).subscribe(filterFormValue => this.caseFilterService.updateFilters(filterFormValue));

    this.companyFilteringCtrl.valueChanges
      .pipe(
        startWith(''),
        filter(search => !!search),
        tap(() => this.isSearchingForCompanies = true),
        dynamicSearch<string, CompaniesPageResponse>(search =>
          this.companyService.getCompanies({ search: (search as string).trim(), pageSize: 100 })),
        untilDestroyed(this),
        ).subscribe(response => {
          this.isSearchingForCompanies = false;
          // prevent showing companies twice in the dropdown; must be done because of a bug in the ngx-search component
          this.filteredServerSideCompanies$.next(response.data.filter(el => !this.isCompanyInAppliedFilter(el)));
        });

    this.technologiesFilteringCtrl.valueChanges
      .subscribe(
        search => {
          this.isSearchingForTechnologies = true;
          this.caseService.getAllTechnologies().toPromise().then(allTechnologies$ => {
            this.allTechnologies$ = allTechnologies$;
            this.allTechnologies$ = this.allTechnologies$.filter(technology => technology.name.includes(search));
            this.isSearchingForTechnologies = false;
          });
        }
      );

    this.reportingService.getTopTechnologies()
      .pipe(
        map(technologyArray => technologyArray.map(
          technologyObject => [technologyObject.name, technologyObject.count]
        )),
        untilDestroyed(this)
      ).subscribe(data => this.topTechnologies = data);

    this.reportingService.getTopCompanies()
      .pipe(
        map(companyArray => companyArray.map(
          companyObject => [companyObject.name, companyObject.count]
        )),
        untilDestroyed(this)
      ).subscribe(data => this.topCompanies = data);

    if (this.userRole !== 'visitor') {
      this.reportingService.getTopContributors({currentMonth: true})
      .pipe(
        map(topContributors => topContributors.filter(contributor => contributor.resource === 'cases')),
        map(topContributors => topContributors.sort((c1, c2) => c2.count - c1.count).slice(0,5)),
        map(caseContributors => caseContributors.map(
          contributor => [contributor.user.firstName, contributor.count]
        )),
      ).subscribe(data =>  this.topContributorsMonth = data);

      this.reportingService.getTopContributors()
      .pipe(
        map(topContributors => topContributors.filter(contributor => contributor.resource === 'cases')),
        map(topContributors => topContributors.sort((c1, c2) => c2.count - c1.count).slice(0,5)),
        map(caseContributors => caseContributors.map(
          contributor => [contributor.user.firstName, contributor.count]
        )),
      ).subscribe(data => this.topContributors = data);
    }
  }

  isCompanyInAppliedFilter(company: Company) {
    return this.appliedCompanyFilters.some(element => element.id === company.id);
  }

  isTechnologyInAppliedFilter(technology: Technology) {
    return this.appliedTechnologyFilters.some(element => element.id === technology.id);
  }

  openCreateCaseDialog() {
    this.matDialog.open(CreateCaseComponent, {width: '700px'});
  }

  removeCompanyFilter(companyToRemove: any) {
    const newValue = this.filterForm.controls.companies.value.filter(company => company.id !== companyToRemove.id);
    console.log(newValue);
    this.filterForm.controls.companies.patchValue(newValue);
  }

  removeCaseTypeFilter(caseTypeToRemove: any) {
    const newValue = this.filterForm.controls.caseTypes.value.filter(caseType => caseType.id !== caseTypeToRemove.id);
    this.filterForm.controls.caseTypes.patchValue(newValue);
  }

  removeTechnologyFilter(technologyToRemove: any) {
    const newValue = this.filterForm.controls.technologies.value.filter(technology => technology.id !== technologyToRemove.id);
    this.filterForm.controls.technologies.patchValue(newValue);
  }

  ngOnDestroy() { }


  compareFilters(o1: Company | Technology, o2: Company | Technology) {
    return o1.id === o2.id;
  }

  removeAllFilters() {
    this.filterForm.controls.caseTypes.patchValue([]);
    this.filterForm.controls.companies.patchValue([]);
    this.filterForm.controls.technologies.patchValue([]);
  }
}
