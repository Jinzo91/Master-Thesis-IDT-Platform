import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import { Observable, EMPTY } from 'rxjs';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { ReportingService } from 'src/app/services/reporting.service';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CASE_TYPES } from 'src/app/shared/models/case.model';
import { Company, Industries } from 'src/app/shared/models/company.model';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';


export interface Counts {
  cases: string;
  companies: string;
}


@Component({
  selector: 'idt-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit, OnDestroy {

  @ViewChild('dashboardContainer', {static: false}) dashboardContainer: ElementRef;

  industries = Industries;

  public counts$: Observable<Counts>;
  topTechnologies: any[] = [];
  topCompanies: any[] = [];
  todaysCaseCount: number;
  todaysCompanyCount: number;
  caseTypeDistribution: any[] = [];
  progressCasesAndCompanies = [];
  progressCases = [{
    name: 'Cases',
    series: []
  }];
    progressCompanies = [{
    name: 'Companies',
    series: []
  }];
  newestCompanies;
  trendingTechnologies;
  displayedColumns: string[] = ['logo', 'name'];

  constructor(
    private dashboardService: DashboardService,
    private reportingService: ReportingService,
    public companyService: CompanyService,
    private router: Router,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.dashboardService.onRemoveMarginForDashboard(true);

    this.counts$ = this.reportingService.getCounts()
      .pipe(
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      );


    this.reportingService.getTopTechnologies()
    .pipe(
      map(technologyArray => technologyArray.map(
        technologyObject => {
          return {name: technologyObject.name, value: technologyObject.count};
        }
      )),
      untilDestroyed(this),
      catchError(error => {
        this.showErrorSnackbar(error.message, 'Close');
        return EMPTY;
      })
    ).subscribe(data => this.topTechnologies = data);

    this.reportingService.getTopCompanies()
    .pipe(
      map(companiesArray => companiesArray.map(
        companyObject => {
          return {name: companyObject.name, value: companyObject.count};
        }
      )),
      untilDestroyed(this),
      catchError(error => {
        this.showErrorSnackbar(error.message, 'Close');
        return EMPTY;
      })
    ).subscribe(data => this.topCompanies = data);


    this.reportingService.getCaseTypeDistribution()
      .pipe(
        map(caseTypeArray => caseTypeArray.map(
          caseType => {
            return {name: CASE_TYPES.find(type => type.id === caseType.caseType.toString()).name, value: caseType.count.toString()};
          }
        )),
        untilDestroyed(this),
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      ).subscribe(data => this.caseTypeDistribution = data);


    this.reportingService.getProgressCases()
      .pipe(
        map(progressCasesArray => progressCasesArray.map(
          progressCasesObject => {
            return {name: progressCasesObject.month, value: progressCasesObject.count.toString()};
          }
        ))
      ).subscribe(data => {
        this.progressCases[0].series = data;
        this.progressCasesAndCompanies = this.progressCasesAndCompanies.concat(this.progressCases);
      });

    this.reportingService.getProgressCompanies()
      .pipe(
        map(progressCompaniesArray =>  progressCompaniesArray.map(
          progressCompaniesObject => {
            return {name: progressCompaniesObject.month, value: progressCompaniesObject.count.toString()};
          }
        ))
      ).subscribe(data => {
        this.progressCompanies[0].series = data;
        this.progressCasesAndCompanies = this.progressCasesAndCompanies.concat(this.progressCompanies);
      });


    this.reportingService.getNewestCompanies()
      .pipe(

      ).subscribe(data => {
        this.newestCompanies = data;
      });


    this.reportingService.getTodaysCaseCount()
      .pipe(

      ).subscribe(data => this.todaysCaseCount = data[0].count);

    this.reportingService.getTodaysCompanyCount()
      .pipe(

      ).subscribe(data => this.todaysCompanyCount = data[0].count);

    this.reportingService.getTrendingTechnologies()
      .pipe(
        map(trendingTechnologiesArray =>  trendingTechnologiesArray.map(
          trendingTechnologiesObject => {
            return {name: trendingTechnologiesObject.name, value: trendingTechnologiesObject.count.toString()};
          }
        ))
      ).subscribe(data => this.trendingTechnologies = data);
  }


  onDragStart(event): void {
    event.dataTransfer.setData('text/plain', event.target.id.charAt(event.target.id.length - 1));
  }

  onDragOver(event): void {
    event.preventDefault();
  }

  onDrop(event): void {
    let sourceIndex: number;
    let destIndex: number;
    const destID: number = parseInt(event.currentTarget.id.charAt(event.currentTarget.id.length - 1));
    const sourceID: number = parseInt(event.dataTransfer.getData('text'));
    this.dashboardContainer.nativeElement.childNodes.forEach((node, index) => {
      if (parseInt(node.id.charAt(node.id.length - 1)) === sourceID) {
        sourceIndex = index;
      }
      if (parseInt(node.id.charAt(node.id.length - 1)) === destID) {
        destIndex = index;
      }
    })
    this.dashboardContainer.nativeElement.insertBefore(this.dashboardContainer.nativeElement.children[sourceIndex], this.dashboardContainer.nativeElement.children[destIndex+1]);
    event.dataTransfer.clearData();
  }


  showErrorSnackbar(message: string, action: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'error',
        message
      }
    });
  }

  onRowClick(row: Company) {
    if (row.id) {
      this.router.navigate(['/companies', row.id]);
    }
  }

  defaultImage(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  }

  ngOnDestroy(): void {
    this.dashboardService.onRemoveMarginForDashboard(false);
  }
}
