import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSort, PageEvent, SortDirection } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { CompanyService } from '../../../../services/company.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { tap, map } from 'rxjs/operators';
import { CasesPageResponse, SortOrder, CaseService } from 'src/app/services/case.service';
import { User } from 'src/app/shared/models/user.model';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';

export interface CaseTableData {
  logo: string;
  title: string;
  company: string;
  createdAt: string;
  createdBy: string;
  disabled: boolean;
}

@Component({
  selector: 'idt-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit, OnDestroy {

  dataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  dataEmpty$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  paginationChanges$: BehaviorSubject<PageEvent>;

  displayedColumns: string[];
  tableData$: Observable<CaseTableData[]>;
  totalResults$ = new BehaviorSubject<number>(0);
  pageSize: number = 10;
  searchString = '';

  @Input('data') cases$: Observable<CasesPageResponse>;
  @Input('searchString') searchString$: Observable<string> = of('');
  @Input('currentPage') currentPage$: Observable<number> = of(1);
  @Input('isBotList') isBotList?: boolean = false;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() pageSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() sortChanged: EventEmitter<{sort: string, sortOrder: SortOrder}> = new EventEmitter();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private companyService: CompanyService,
    private caseService: CaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.searchString$.pipe(untilDestroyed(this)).subscribe(data => this.searchString = data);
    if (!this.isAdmin()) {
      if (this.isBotList) {
        this.displayedColumns = ['logo', 'title', 'company', 'createdAt', 'createdBy', 'disabled', 'addToCases', 'disableCases'];
      } else {
        this.displayedColumns = ['logo', 'title', 'company', 'createdAt', 'createdBy'];
      }
    } else {
      if (this.isBotList) {
        this.displayedColumns = ['logo', 'title', 'company', 'createdAt', 'disabled', 'addToCases', 'disableCases'];
      } else {
        this.displayedColumns = ['logo', 'title', 'company', 'createdAt', 'createdBy', 'disabled'];
      }
    }

    const firstPage = new PageEvent();
    firstPage.pageIndex = this.caseService.getLastPageNumber();
    if (firstPage.pageIndex == -1) {
      firstPage.pageIndex = 0;
    }
    firstPage.pageSize = this.pageSize;
    this.paginationChanges$ = new BehaviorSubject<PageEvent>(firstPage);

    this.paginationChanges$.pipe(
      untilDestroyed(this),
      tap(() => this.dataLoaded$.next(false))
    ).subscribe(pageEvent => {
      this.caseService.setLastPageNumber(pageEvent.pageIndex);
      this.pageChanged.emit(pageEvent.pageIndex + 1);
      this.pageSizeChanged.emit(pageEvent.pageSize);
    });

    this.sort.sortChange.pipe(
      untilDestroyed(this))
      .subscribe(change => {
        // transform as the column has a different name than the needed BE filter value
        if (change.active === 'company') {
          change.active = 'company.name';
        }

        if (change.active === 'createdBy') {
          change.active = 'createdBy.lastName';
        }
        this.sortChanged.emit({sort: change.active, sortOrder: this.convertSortDirectionType(change.direction)});
      });


    this.tableData$ = this.cases$.pipe(
      untilDestroyed(this),
      tap(response => {
        this.totalResults$.next(response.total);
        this.dataLoaded$.next(true);
        this.dataEmpty$.next(response.data.length === 0);
      }),
      map(response => {
        return response.data.map(singleCase => ({
          id: singleCase.id,
          title: singleCase.title,
          company: singleCase.company.name,
          createdAt: singleCase.createdAt,
          createdBy: singleCase.createdBy.lastName + ', ' + singleCase.createdBy.firstName,
          logo: this.companyService.getLogo(singleCase.company.id),
          disabled: singleCase.disabled
        }));
      }),
    );
  }

  onRowClick(row) {
    if (row.id) {
      this.router.navigate(['cases', row.id]);
    }
  }

  onAddCase(event, row) {
    event.stopPropagation();
    this.caseService.updateCase(
      row.id,
      {createdBy: this.authService.user}
      ).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully added a case!', 'Close', 'success');
          this.reloadData();
        },
        error => this.showSnackbar('We could not change this data!', 'Close', 'error')
      );
  }

  onRemoveCase(event, row) {
    event.stopPropagation();
    this.caseService.deleteCase(row.id)
      .pipe(untilDestroyed(this))
            .subscribe(
              data => {
                this.showSnackbar('You successfully disabled the case!', 'Close', 'success');
                this.reloadData();
              },
              error => this.showSnackbar(error.message, 'Close', 'error')
            );
  }

  isAdmin() {
    const user = this.authService.user;
    if (user) {
      return this.authService.role === 'admin';
    } else {
      return false;
    }
  }

  defaultImage(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  }

  convertSortDirectionType(sortDir: SortDirection): SortOrder {
    return sortDir === '' || sortDir === 'asc' ? 'ASC' : 'DESC';
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  reloadData() {
    this.tableData$ = this.cases$.pipe(
      untilDestroyed(this),
      tap(response => {
        this.totalResults$.next(response.total);
        this.dataLoaded$.next(true);
        this.dataEmpty$.next(response.data.length === 0);
      }),
      map(response => {
        return response.data.map(singleCase => ({
          id: singleCase.id,
          title: singleCase.title,
          company: singleCase.company.name,
          createdAt: singleCase.createdAt,
          createdBy: singleCase.createdBy.lastName + ', ' + singleCase.createdBy.firstName,
          logo: this.companyService.getLogo(singleCase.company.id),
          disabled: singleCase.disabled
        }));
      }),
    );
  }

  ngOnDestroy() { }
}
