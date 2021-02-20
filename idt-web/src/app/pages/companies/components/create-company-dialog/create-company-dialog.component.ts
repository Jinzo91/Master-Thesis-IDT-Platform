import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog} from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Industries, SourceCompany } from 'src/app/shared/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { CreateCompanyManuallyDialogComponent } from '../../components/create-company-manually-dialog/create-company-manually-dialog.component';

@Component({
  selector: 'idt-create-company-dialog',
  templateUrl: './create-company-dialog.component.html',
  styleUrls: ['./create-company-dialog.component.scss']
})
export class CreateCompanyComponent implements OnInit, OnDestroy {
  companyFormGroup: FormGroup;
  industries = Industries;

  searchResult: SourceCompany[] = []
  selectedCompany: SourceCompany;
  
  constructor(
    public dialogRef: MatDialogRef<CreateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public entity: any,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.companyFormGroup = this.formBuilder.group({
      name: [this.entity.companyName],
      url: [this.entity.url]
    });
  }

  searchByName() {
    if(this.companyFormGroup.controls.name.value === '') {
      return;
    }
    this.companyService.searchSourceCompanyByName(this.companyFormGroup.controls.name.value)
      .subscribe(data => {
        this.searchResult = data;
      });
  }

  searchByUrl() {
    if(this.companyFormGroup.controls.url.value === '') {
      return;
    }
    this.companyService.searchSourceCompanyByUrl(this.companyFormGroup.controls.url.value)
      .subscribe(data => {
        this.searchResult = data;
      });
  }

  selectCompany(company: SourceCompany) {
    if (company == this.selectedCompany) {
      this.selectedCompany = null;
    } else {
      this.selectedCompany = company;
    }
  }

  createCompany() {
    if(this.selectedCompany == null) {
      return;
    }
    let streetLine = this.selectedCompany.Street == null ? "" : this.selectedCompany.Street + ", ";
    let postcodeLine = this.selectedCompany.Postcode == null ? "" : this.selectedCompany.Postcode + ", ";
    let cityLine = this.selectedCompany.City == null ? "" : this.selectedCompany.City + ", ";
    this.companyService.addCompany({
      name: this.selectedCompany.Name,
      description: this.selectedCompany.FullOverview,
      website: this.selectedCompany.Website,
      headcount: this.selectedCompany.Employees,
      headoffice: streetLine + postcodeLine + cityLine + this.selectedCompany.Country,
      disabled: false,
      industry: this.selectedCompany.Industry,
      revenue: this.selectedCompany.OperatingRevenue,
      companySourceId: this.selectedCompany.companySourceId,
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

  createManually() {
    this.dialogRef.close();
    this.matDialog.open(CreateCompanyManuallyDialogComponent, {
      width: '600px',
      data: {
        companyName: ''
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {}
}
