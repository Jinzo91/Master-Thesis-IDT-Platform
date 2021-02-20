import {Component, ViewChild, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Company, Industries } from 'src/app/shared/models/company.model';
import { PageEvent } from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {CompanyService, CompaniesPageResponse} from '../../../../services/company.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, tap, filter} from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {SortOrder} from '../../../../services/case.service';
import { UserService } from 'src/app/services/user.service.ts.service';


interface CompanyTableData {
  id: string;
  name: string;
  createdAt: string;
  disabled: boolean;
  industry: string;
}

@Component({
  selector: 'idt-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  userRole;

  followingCompanies: number[];

  dataLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  dataEmpty$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  paginationChanges$: BehaviorSubject<PageEvent>;

  displayedColumns: string[];
  tableData$: Observable<CompanyTableData[]>;
  totalResults$ = new BehaviorSubject<number>(0);
  pageSize: number = 10;
  searchString = '';

  industries = Industries;

  @Input('data') companies$: Observable<CompaniesPageResponse>;
  @Input('searchString') searchString$: Observable<string> = of('');
  @Input('currentPage') currentPage$: Observable<number> = of(1);
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() pageSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() sortChanged: EventEmitter<{sort: string, sortOrder: SortOrder}> = new EventEmitter();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    public companyService: CompanyService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.userRole = this.authService.role;

    this.searchString$.pipe(untilDestroyed(this)).subscribe(data => this.searchString = data);

    if (!this.isAdmin()) {
      if (!(this.authService.user === null)) {
        this.userService.getFollowingCompanies(this.authService.user.id).subscribe(data => this.followingCompanies = data);
        this.displayedColumns = ['logo', 'name', 'industry', 'createdAt', 'followCompany'];
      } else {
        this.displayedColumns = ['logo', 'name', 'industry', 'createdAt'];
      }
    } else {
      this.userService.getFollowingCompanies(this.authService.user.id).subscribe(data => this.followingCompanies = data);
      this.displayedColumns = ['logo', 'name', 'industry', 'createdAt', 'disabled', 'followCompany'];
    }

    const firstPage = new PageEvent();
    firstPage.pageIndex = 0;
    firstPage.pageSize = this.pageSize;
    this.paginationChanges$ = new BehaviorSubject<PageEvent>(firstPage);

    this.paginationChanges$.pipe(
      untilDestroyed(this),
      tap(() => this.dataLoaded$.next(false))
    ).subscribe(pageEvent => {
      this.pageChanged.emit(pageEvent.pageIndex + 1);
      this.pageSizeChanged.emit(pageEvent.pageSize);
    });

    this.sort.sortChange.pipe(
      untilDestroyed(this)
    ).subscribe(change =>
      this.sortChanged.emit({sort: change.active, sortOrder: this.convertSortDirectionType(change.direction)})
    );

    this.tableData$ = this.companies$
    .pipe(
      untilDestroyed(this),
      filter(response => !!response),
      tap(response => {
        this.totalResults$.next(response.total);
        this.pageSize = response.count;
        this.dataLoaded$.next(true);
        this.dataEmpty$.next(response.data.length === 0);
      }),
      map( response =>
        response.data.map( company => {
          return ({
          id: company.id,
          name: company.name,
          createdAt: company.createdAt,
          industry: company.industry == null ? null : this.industries[company.industry].name,
          disabled: company.disabled
          });
        })
      )
    );
  }

  onRowClick(row: Company) {
    if (row.id) {
      this.router.navigate(['/companies', row.id]);
    }
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

  onFollowCompany(event, compId) {
    event.stopPropagation();
    const userId = this.authService.user.id;
    this.userService.followCompany(userId, compId).subscribe(data => this.followingCompanies = data);
  }

  onUnfollowCompany(event, compId) {
    event.stopPropagation();
    const userId = this.authService.user.id;
    this.userService.unfollowCompany(userId, compId).subscribe(data => this.followingCompanies = data);
  }

  isUserFollowingCompany(compId: number): boolean {
    return this.followingCompanies.includes(compId);
  }

  ngOnDestroy() {}
}
