import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddImgDialogComponent, DialogData } from 'src/app/shared/components/add-img-dialog/add-img-dialog.component';
import { Company, Industries } from 'src/app/shared/models/company.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {CaseService, CasesPageResponse, SortOrder} from '../../../../services/case.service';
import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';
import { FileLoaderService } from '../../../../services/file-loader.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {BehaviorSubject, combineLatest, EMPTY, Observable, Observer} from 'rxjs';
import {catchError, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import { ConfirmQuitDialogComponent } from 'src/app/shared/components/confirm-quit-dialog/confirm-quit-dialog.component';
import { dynamicSearch } from '../../../../shared/operators/dynamic-search';
import { UserService } from 'src/app/services/user.service.ts.service';
import { Location } from '@angular/common';

interface SortChange {
  sort: string;
  sortOrder: SortOrder;
}

@Component({
  selector: 'idt-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  providers: [DatePipe]
})
export class CompanyDetailComponent implements OnInit, OnDestroy {

  company: Company;
  relatedCases$: Observable<CasesPageResponse>;
  relatedCasesPage$ = new BehaviorSubject(0);
  relatedCasesPageSize$ = new BehaviorSubject(10);
  relatedCasesSort$ = new BehaviorSubject({ sort: 'createdAt', sortOrder: 'DESC' } as SortChange);

  descriptionMaxLength = 6000;
  descriptionLengthRemaining$ = new BehaviorSubject<number>(this.descriptionMaxLength);

  public deleteLabel = '';
  public industries = Industries;

  urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;

  dialogData: DialogData = {
    imgFile: null,
  };

  public editMode = false;

  companyForm = this.formBuilder.group({
    name: [{ value: '', disabled: true }, Validators.required],
    logo: [{ value: '', disabled: true }, Validators.required],
    headcount: [{ value: '', disabled: true }],
    website: [{ value: '', disabled: true }, Validators.pattern(this.urlPattern)],
    industry: [{ value: '', disabled: true }],
    headoffice: [{ value: '', disabled: true }],
    description: [{ value: '', disabled: true }],
    createdBy: [{ value: '', disabled: true }],
    createdAt: [{ value: '', disabled: true }],
    modifiedBy: [{ value: '', disabled: true }],
    modifiedAt: [{ value: '', disabled: true }]
  });

  followingCompanies: number[] = [];

  constructor(
    private companyService: CompanyService,
    private caseService: CaseService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private fileLoader: FileLoaderService,
    private userService: UserService,
    private location: Location
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.getCurrentNavigation().extras.state),
      filter(state => state && state.edit),
      tap(() => this.toggleEdit()),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnInit() {
    this.company = this.activatedRoute.snapshot.data.company;

    if (this.isLoggedIn()) {
      this.userService.getFollowingCompanies(this.authService.user.id).subscribe(data => this.followingCompanies = data);
    }

    this.companyForm.patchValue({
      name: this.company.name,
      logo: this.companyService.getLogo(this.company.id),
      headcount: this.company.headcount,
      website: this.company.website,
      industry: this.company.industry,
      headoffice: this.company.headoffice,
      description: this.company.description,
      createdBy: this.company.createdBy ?
        this.company.createdBy.firstName + ' ' + this.company.createdBy.lastName : '',
      createdAt: this.company.createdAt ?
      // TODO: not needed after the data migration: remove after all fields are filled out
        this.datePipe.transform(new Date(this.company.createdAt), 'MM/dd/yyyy') : '',
      modifiedBy: this.company.modifiedBy ?
        this.company.modifiedBy.firstName + ' ' + this.company.modifiedBy.lastName : '',
      modifiedAt: this.company.modifiedAt ?
        this.datePipe.transform(new Date(this.company.modifiedAt), 'MM/dd/yyyy') : ''
    });
    this.deleteLabel = this.company.disabled ? 'Enable' : '';

    this.descriptionLengthRemaining$.next(this.descriptionMaxLength -
      (this.companyForm.controls.description.value ? this.companyForm.controls.description.value.length : 0));
    this.companyForm.controls.description.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(
        value => this.descriptionLengthRemaining$.next(this.descriptionMaxLength - value.length)
      );

    // Get related cases
    this.relatedCases$ = combineLatest(
      this.relatedCasesPage$.pipe(distinctUntilChanged()),
      this.relatedCasesPageSize$.pipe(distinctUntilChanged()),
      this.relatedCasesSort$.pipe(distinctUntilChanged()),
    ).pipe(
      map(([page, pageSize, sortObject]) => ({page, pageSize, sortObject })),
      switchMap((params) =>
        this.caseService.getCases({
          pageIndex: params.page,
          pageSize: params.pageSize,
          sort: params.sortObject.sort,
          sortOrder: params.sortObject.sortOrder,
          filter: [{ field: 'company', value: [this.company]}]
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
      ),
    );
  }

  ngOnDestroy() { }

  toggleEdit() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.companyForm.enable();
    } else {
      this.companyForm.disable();
      this.submitForm();
    }
  }

  cancel() {
    if (this.editMode) {
      this.editMode = false;
      this.companyForm.disable();
    }
  }

  back() {
    this.location.back();
  }

  submitForm() {
    this.companyService.updateCompany({
      name: this.companyForm.controls.name.value,
      headcount: this.companyForm.controls.headcount.value,
      website: this.companyForm.controls.website.value,
      industry: this.companyForm.controls.industry.value,
      headoffice: this.companyForm.controls.headoffice.value,
      description: this.companyForm.controls.description.value
    }, this.company.id)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully updated the company!', 'Close', 'success');
        },
        error => this.showSnackbar(error.message, 'Close', 'error')
      );
  }

  getErrorMessage(key: string) {
    let error = '';
    if (this.companyForm.controls[key].hasError('required')) {
      error = 'This field is required';
    } else if (this.companyForm.controls[key].hasError('pattern')) {
      error = 'This field must be an url';
    }
    return error;
  }

  editingAllowed() {
    const user = this.authService.user;
    if (user) {
      return this.authService.role === 'admin' || this.company.createdBy.id === user.id;
    } else {
      return false;
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

  isLoggedIn() {
    return this.authService.user !== null;
  }

  disableCompany() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: 'company'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companyService.deleteCompany(this.company.id)
          .pipe(untilDestroyed(this))
          .subscribe(
            data => {
              this.showSnackbar('You successfully disabled the company!', 'Close', 'success');
              setTimeout(() => this.router.navigate(['/companies'], { replaceUrl: true }), 300);
            },
            error => this.showSnackbar(error.message, 'Close', 'error')
          );
      }
    });
  }

  enableCompany() {
    this.companyService.enableCompany(this.company.id)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully enabled the company!', 'Close', 'success');
          this.company.disabled = false;
        },
        error => this.showSnackbar(error.message, 'Close', 'error')
      );
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  defaultImage() {
    this.companyForm.controls.logo.patchValue('https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
  }

  uploadImage(files) {
    this.dialogData.imgFile = this.fileLoader.uploadFile(files, 'image', 0, 1000000);
    if (this.dialogData.imgFile) {
      const dialogRef = this.dialog.open(AddImgDialogComponent, {
        width: '750px',
        data: this.dialogData
      });

      dialogRef.afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data) {
          this.companyService.updateLogo(this.company.id, this.dialogData.imgFile).subscribe(
            val => {
              this.companyForm.controls.logo.patchValue(this.companyService.getLogo(this.company.id) + '?' + new Date().getTime());
              this.showSnackbar('You successfully updated the company\'s logo!', 'Close', 'success');
            },
            error => this.showSnackbar(error.message, 'Close', 'error')
          );
        }
      });
    }
  }

  getAbsoluteCompanyLink(link: string) {
    return link && link.startsWith('http') ? link : '//' + link;
  }

   // prevent the user from quitting without saving changes made
   canDeactivate(): Observable<boolean> | boolean {
    if (!this.editMode) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      let dialogRef = this.dialog.open(ConfirmQuitDialogComponent, {width: '400px'});

      dialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(result => {
        observer.next(result);
        observer.complete();
      }, (error) => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  onFollowCompany(event, compId) {
    const userId = this.authService.user.id;
    this.userService.followCompany(userId, compId).subscribe(data => this.followingCompanies = data);
  }

  onUnfollowCompany(event, compId) {
    const userId = this.authService.user.id;
    this.userService.unfollowCompany(userId, compId).subscribe(data => this.followingCompanies = data);
  }

  isUserFollowingCompany(compId: string): boolean {
    return this.followingCompanies.includes(parseInt(compId, 10));
  }
}
