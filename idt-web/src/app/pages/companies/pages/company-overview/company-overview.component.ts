import {Component, OnInit, OnDestroy} from '@angular/core';
import { EMPTY, BehaviorSubject, combineLatest, iif, of, Observable, merge } from 'rxjs';
import {CompanyService} from 'src/app/services/company.service';
import {catchError, distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import {MatSnackBar, MatDialog} from '@angular/material';
import {ToasterComponent} from '../../../../shared/components/toaster/toaster.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {dynamicSearch} from '../../../../shared/operators/dynamic-search';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {SortOrder} from '../../../../services/case.service';
import {CompanyFilters, CompanyFilterService} from '../../../../services/company-filter.service';
import {FormBuilder} from '@angular/forms';
import {RoutingStateService} from '../../../../services/routing-state.service';
import { CreateCompanyComponent } from '../../components/create-company-dialog/create-company-dialog.component';
import { CreateCompanyManuallyDialogComponent } from '../../components/create-company-manually-dialog/create-company-manually-dialog.component';


interface SortChange {
  sort: string;
  sortOrder: SortOrder;
}

@Component({
  selector: 'idt-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit, OnDestroy {
  userRole;

  filterForm = this.formBuilder.group({
    search: '',
  });

  searchString$: Observable<string>;

  filters$ = this.companyFilterService.filters$;
  currentPage$ = new BehaviorSubject(0);
  currentPageSize$ = new BehaviorSubject(10);
  currentSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

  routeHistory$ = this.routingStateService.routeHistory$;

  readonly companies$ = combineLatest(
        this.filters$.pipe(distinctUntilChanged()),
        this.currentPage$.pipe(distinctUntilChanged()),
        this.currentPageSize$.pipe(distinctUntilChanged()),
        this.currentSort$.pipe(distinctUntilChanged())
  )
    .pipe(
      untilDestroyed(this),
      map(([filters, page, pageSize, sortObject]) => ({ filters, page, pageSize, sortObject })),
      dynamicSearch(params =>
        this.companyService.getCompanies({
          search: params.filters.search.trim(),
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

  constructor(
    private companyService: CompanyService,
    private matDialog: MatDialog,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private companyFilterService: CompanyFilterService,
    private formBuilder: FormBuilder,
    private routingStateService: RoutingStateService,
    ) { }

  ngOnInit() {
    this.userRole = this.authService.role;

    // Restarting page number when modifying filters
    this.filters$
      .pipe(distinctUntilChanged())
      .subscribe(() => this.currentPage$.next(1));

    combineLatest(
      this.filters$,
      this.routeHistory$
        .pipe(
          // Getting the last app page url visited
          map(values => values[values.length - 2] || '/')
        )
      ).pipe(
        take(1),
        mergeMap(([filters, lastRoute]) =>
          iif(
            () => lastRoute.toString().split('/')[1] === 'companies'
              || lastRoute.toString().split('/')[1].includes('search'),
            of(filters),
            of(this.companyFilterService.EMPTY_FILTER)
          )
        )
      ).subscribe(value => {
      this.companyFilterService.updateFilters(value as CompanyFilters);
      this.filterForm.patchValue(value as any);
    });

    this.searchString$ = this.filterForm.controls.search.valueChanges;

    this.filterForm.valueChanges
      .pipe(
        untilDestroyed(this)
      ).subscribe(value => this.companyFilterService.updateFilters(value));
  }

  openCreateCompanyDialog() {
    this.matDialog.open(CreateCompanyComponent, {
      width: '600px',
      data: {
        companyName: ''
      }
    });
  }

  ngOnDestroy() { }
}
