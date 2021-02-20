import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Industries } from 'src/app/shared/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-create-company-manually-dialog',
  templateUrl: './create-company-manually-dialog.component.html',
  styleUrls: ['./create-company-manually-dialog.component.scss']
})
export class CreateCompanyManuallyDialogComponent implements OnInit {
  companyFormGroup: FormGroup;
  industries = Industries;
  descriptionMaxLength = 6000;
  descriptionLengthRemaining$:Observable<number>;

  urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;

  constructor(
    public dialogRef: MatDialogRef<CreateCompanyManuallyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entity: any,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.companyFormGroup = this.formBuilder.group({
      name: [this.entity.companyName, Validators.required],
      headcount: [null],
      website: ['', { validators: [Validators.required, Validators.pattern(this.urlPattern)] }],
      industry: ['', Validators.required],
      headoffice: [''],
      description: [''],
    });

    this.descriptionLengthRemaining$ = this.companyFormGroup.controls.description.valueChanges
    .pipe(
      startWith(this.companyFormGroup.controls.description.value),
      map(value => this.descriptionMaxLength - value.length),
    );
  }

  getErrorMessage(key: string) {
    let error = '';

    if (this.companyFormGroup.controls[key].hasError('required')) {
      error = 'This field is required';
    } else if (this.companyFormGroup.controls[key].hasError('pattern')) {
      error = 'This field must be an url';
    }
    return error;
  }

  createCompany() {
    if(this.companyFormGroup.invalid) {
      return;
    }
    this.companyService.addCompany({
      name: this.companyFormGroup.controls.name.value,
      description: this.companyFormGroup.controls.description.value,
      website: this.companyFormGroup.controls.website.value,
      industry: this.industries[this.companyFormGroup.controls.industry.value].name,
      headcount: this.companyFormGroup.controls.headcount.value,
      headoffice: this.companyFormGroup.controls.headoffice.value,
      disabled: false
    }).pipe(untilDestroyed(this))
      .subscribe(data => {
        this.matSnackBar.openFromComponent(ToasterComponent,{
          data: {
            type: 'success',
            message: 'You have successfully created a company.'
          }
        });
        if (this.router.url === '/companies') {
          this.router.navigateByUrl(`companies/${data.id}`, {state: {edit: true}}).then(this.closeDialog.bind(this));
        } else {
          // stay here
          this.dialogRef.close();
        }
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {}
}