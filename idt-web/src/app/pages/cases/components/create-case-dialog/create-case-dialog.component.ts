import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CASE_TYPES, Technology } from 'src/app/shared/models/case.model';
import { Company } from 'src/app/shared/models/company.model';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { CompanyService, CompaniesPageResponse } from 'src/app/services/company.service';
import { CaseService } from 'src/app/services/case.service';
import { Router } from '@angular/router';
import { startWith, filter, tap, map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { dynamicSearch } from 'src/app/shared/operators/dynamic-search';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { CreateCompanyComponent } from 'src/app/pages/companies/components/create-company-dialog/create-company-dialog.component';


@Component({
  selector: 'idt-create-case-dialog',
  templateUrl: './create-case-dialog.component.html',
  styleUrls: ['./create-case-dialog.component.scss']
})
export class CreateCaseComponent implements OnInit, OnDestroy {
  caseFormGroup: FormGroup;
  caseCreated: boolean = false;
  caseId: string;
  caseTypes = CASE_TYPES;
  companies: Partial<Company>[];
  urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;

  allTechnologies$: Observable<Technology[]>;
  filteredServerSideCompanies$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  serverSideFilteringCtrl: FormControl = new FormControl();
  isSearchingForCompanies: boolean = false;
  descriptionMaxLength = 3000;
  descriptionLengthRemaining$: Observable<number>;
  searchInput: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public entity: string,
    public dialogRef: MatDialogRef<CreateCaseComponent>,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private matSnackBar: MatSnackBar,
    private caseService: CaseService,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {

    this.caseFormGroup = this.formBuilder.group({
      title: new FormControl('', { validators: Validators.required }),
      description: new FormControl('', { validators: Validators.required }),
      featured: new FormControl(false),
      caseType: new FormControl(null, { validators: Validators.required }),
      url: new FormControl('', { validators: [Validators.pattern(this.urlPattern)]}),
      company: new FormControl('', { validators: Validators.required })
    });
    
    this.allTechnologies$ = this.caseService.getAllTechnologies();

    this.serverSideFilteringCtrl.valueChanges
      .pipe(
        startWith(''),
        filter(search => !!search),
        tap(() => this.isSearchingForCompanies = true),
        untilDestroyed(this),
        dynamicSearch<string, CompaniesPageResponse>(search => this.companyService.getCompanies({search: (search as string).trim(), pageSize: 100})
      )).subscribe(response => {
        this.searchInput = this.serverSideFilteringCtrl.value;
        this.isSearchingForCompanies = false;
        this.filteredServerSideCompanies$.next(response.data);
      });

      this.descriptionLengthRemaining$ = this.caseFormGroup.controls.description.valueChanges
      .pipe(
        startWith(this.caseFormGroup.controls.description.value),
        map(value => this.descriptionMaxLength - value.length),
      );
  }

  getErrorMessage(key: string) {
    let error = '';

    if (this.caseFormGroup.controls[key].hasError('required')) {
      error = 'This field is required';
    } else if (this.caseFormGroup.controls[key].hasError('pattern')) {
      error = 'This field must be an url';
    }
    return error;
  }

  createCase() {
    if(this.caseFormGroup.invalid) {
      return;
    }

    const newCase = {
      title: this.caseFormGroup.controls.title.value,
      description: this.caseFormGroup.controls.description.value,
      featured: this.caseFormGroup.controls.featured.value,
      company: this.caseFormGroup.controls.company.value,
      caseType: Number(this.caseFormGroup.controls.caseType.value),
      disabled: false,
      ...(this.caseFormGroup.controls.url.value && { url: this.caseFormGroup.controls.url.value })
    };

    this.caseService.addCase(newCase).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully created a case!', 'Close', 'success');
          this.router.navigateByUrl(`cases/${data.id}`, {state: {edit: false}}).then(this.closeDialog.bind(this)); 
        },
        error => this.showSnackbar('We could not save this data!', 'Close', 'error')
      );
  }

  showSnackbar(message: string, action: string, type: string) {
    this.matSnackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openCreateCompanyDialog() {
    this.matDialog.open(CreateCompanyComponent, {
      width: '700px',
      data: {
        companyName: this.searchInput
      }
    });
  }

  ngOnDestroy() {}
}

