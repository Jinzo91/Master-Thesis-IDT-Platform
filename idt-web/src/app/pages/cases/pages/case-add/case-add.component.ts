import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService, CompaniesPageResponse } from 'src/app/services/company.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CaseService } from 'src/app/services/case.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { Company } from 'src/app/shared/models/company.model';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { Observable, EMPTY, ReplaySubject } from 'rxjs';
import { CASE_TYPES, Technology } from 'src/app/shared/models/case.model';
import { catchError, map, filter, startWith, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { dynamicSearch } from 'src/app/shared/operators/dynamic-search';

@Component({
  selector: 'idt-case-add',
  templateUrl: './case-add.component.html',
  styleUrls: ['./case-add.component.scss']
})
export class CaseAddComponent implements OnInit, OnDestroy {

  caseCreated: boolean = false;
  caseId: string;
  caseTypes = CASE_TYPES;
  companies: Partial<Company>[];
  detailsDropdownShown: boolean = false;
  files = [];

  urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  allTechnologies$: Observable<Technology[]>;
  filteredServerSideCompanies$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  serverSideFilteringCtrl: FormControl = new FormControl();
  isSearchingForCompanies: boolean = false;

  constructor(
    private companyService: CompanyService,
    private caseService: CaseService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      title: new FormControl('', { validators: Validators.required }),
      description: new FormControl('', { validators: Validators.required }),
      featured: new FormControl(false),
      url: new FormControl('', { validators: [Validators.pattern(this.urlPattern), Validators.required] }),
      company: new FormControl('', { validators: Validators.required })
    });

    this.secondFormGroup = this.formBuilder.group({
      caseType: new FormControl('', Validators.required)
    });

    this.allTechnologies$ = this.caseService.getAllTechnologies();

    this.serverSideFilteringCtrl.valueChanges
      .pipe(
        startWith(''),
        filter(search => !!search),
        tap(() => this.isSearchingForCompanies = true),
        untilDestroyed(this),
        dynamicSearch<string, CompaniesPageResponse>(search => this.companyService.getCompanies({search: (search as string).trim(), pageSize: 100})
        .pipe(
          tap(response => console.log(response))
        )
      )).subscribe(response => {
        this.isSearchingForCompanies = false;
        this.filteredServerSideCompanies$.next(response.data);
      });
  }

  createCase() {

    // Not good, change this in future.
    if (this.firstFormGroup.errors || !this.firstFormGroup.touched) {
      return;
    }

    if (this.caseCreated) {
      this.caseService.updateCase(this.caseId, {
        title: this.firstFormGroup.controls.title.value,
        description: this.firstFormGroup.controls.description.value,
        featured: this.firstFormGroup.controls.featured.value,
        url: this.firstFormGroup.controls.url.value,
        company: this.firstFormGroup.controls.company.value,
        // fix this hardcode value later on
        disabled: false
      }).pipe(untilDestroyed(this)).subscribe(
        data => {
          this.showSnackbar('You successfully updated the case!', 'Close', 'success');
        },
        error => this.showSnackbar('We could not save this data!', 'Close', 'error')
      );
    } else {
      this.caseService.addCase({
        title: this.firstFormGroup.controls.title.value,
        description: this.firstFormGroup.controls.description.value,
        featured: this.firstFormGroup.controls.featured.value,
        url: this.firstFormGroup.controls.url.value,
        company: this.firstFormGroup.controls.company.value,
        // fix this hardcode value later on
        caseType: 1,
        disabled: false
      }).pipe(untilDestroyed(this))
        .subscribe(
          data => {
            this.showSnackbar('You successfully created a case!', 'Close', 'success');
            this.caseId = data.id;
            this.caseCreated = true;
          },
          error => this.showSnackbar('We could not save this data!', 'Close', 'error')
        );
    }
  }

  addTag(tag: Partial<Technology>) {
    // hier ist etwas faul: check backend once again
    this.caseService.addTechnology(this.caseId, tag).pipe(
      catchError(error => {
        this.showSnackbar(error.message, 'Close', error);
        return EMPTY;
      })
    ).subscribe(
      data => {
        // update values
        this.allTechnologies$ = this.caseService.getAllTechnologies();
      }
    );


  }

  removeTag(tag: Partial<Technology>) {
    this.allTechnologies$.pipe(
      map(technologies => technologies.find(tech => tech.name === tag.name)),
      map((tech: Technology) => tech.id),
      untilDestroyed(this)
    ).subscribe(techId => {
      this.caseService.removeTechnology(this.caseId, techId)
        .subscribe(
          data => { },
          error => this.showSnackbar(error.message, 'Close', error)
        );
    });
  }

  changeCaseType() {
    this.caseService
      .updateCase(this.caseId, { caseType: this.caseTypes.indexOf(this.secondFormGroup.controls.caseType.value) + 1 })
      .pipe(untilDestroyed(this)).subscribe(
        data => this.showSnackbar('We have added these details to your case!', 'Close', 'success'),
        error => this.showSnackbar('We could not save the case type, setting a default for it.', 'Close', 'error')
      );
  }

  submitFiles() {
    setTimeout(() => this.router.navigate(['/cases', this.caseId], { replaceUrl: true }), 300);
  }

  getErrorMessage(key: string) {
    let error = '';

    if (this.firstFormGroup.controls[key].hasError('required')) {
      error = 'This field is required';
    } else if (this.firstFormGroup.controls[key].hasError('pattern')) {
      error = 'This field must be an url';
    }
    return error;
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  onUploadChange(event) {
    this.files = Array.from(event.srcElement.files).map(file => (file as File).name);
  }

  removeUploadedFile(i: number) {
    this.files = this.files.filter((item, index) => i !== index);
  }

  ngOnDestroy() { }
}
