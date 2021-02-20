import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvitationService } from 'src/app/services/invitation.service';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { CaseService } from 'src/app/services/case.service';
import { CarouselSlide } from './case-carousel/case-carousel.component';
import { ReportingService } from 'src/app/services/reporting.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CASE_TYPES, Technology } from 'src/app/shared/models/case.model';
import { CaseFilterService } from 'src/app/services/case-filter.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface Counts {
  cases: string;
  companies: string;
}

@Component({
  selector: 'idt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public counts$: Observable<Counts>;

  emailValue = '';

  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  featuredCases$: Observable<CarouselSlide[]>;
  recentCases: any;
  caseTypes;
  topTechnologies;

  columnNamesTech = ['Contributor Name', 'Number of cases'];
  columnNamesCaseTypes = ['Case Type', 'Number of cases'];

  options = {
    colors: ['#a8cdff'],
    legend: 'bottom',
    width: 400,
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };

  optionsTechChart = {
    colors: ['#a8cdff'],
    legend: 'bottom',
    width: 240,
    height: 180,
    backgroundColor: '#f0f6ff',
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };

  pieChartOptions = {
    colors: ['#c1dbff', '#a8cdff', '#6fa7ff', '#5290ff', '#3880ff'],
    legend: 'bottom',
    width: 240,
    height: 180,
    backgroundColor: 'transparent',
    pieSliceTextStyle: {
      color: 'black'
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };


  constructor(
    private reportingService: ReportingService,
    private caseService: CaseService,
    private caseFilterService: CaseFilterService,
    private invitationService: InvitationService,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

   this.reportingService.getTopTechnologies()
      .pipe(
        map(technologyArray => technologyArray.map(
          technologyObject => [technologyObject.name, technologyObject.count]
        )),
        untilDestroyed(this),
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      ).subscribe(data => this.topTechnologies = data);

      this.reportingService.getCaseTypeDistribution()
      .pipe(
        map(caseTypeArray => caseTypeArray.map(
          caseType => [CASE_TYPES.find(type => type.id === caseType.caseType.toString()).name, caseType.count]
        )),
        untilDestroyed(this),
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      ).subscribe(data => this.caseTypes = data);
    
    this.featuredCases$ = this.caseService.getFeaturedCases()
      .pipe(
        map(featuredCases => featuredCases
          .map((featuredCase, index) => ({
            index: featuredCase.id,
            title: featuredCase.title,
            description: featuredCase.description,
            creationDate: featuredCase.createdAt,
            image: this.caseService.getImage(featuredCase.id)
          }))
        ),
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      );

    this.recentCases = this.caseService.getCases({ limit: 5, sort: 'createdAt', sortOrder: 'DESC' })
      .pipe(
        map(response => response.data
          .map((recentCase, index) => ({
            id: recentCase.id,
            title: recentCase.title,
            creationDate: recentCase.createdAt,
            description: recentCase.description,
            tags: recentCase.technologies,
            company: recentCase.company.name,
            image: this.caseService.getImage(recentCase.id)
          }))
        ),
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      );

    this.counts$ = this.reportingService.getCounts()
      .pipe(
        catchError(error => {
          this.showErrorSnackbar(error.message, 'Close');
          return EMPTY;
        })
      );
  }

  showErrorSnackbar(message: string, action: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'error',
        message
      }
    });
  }

  invite() {
    this.invitationService.inviteUser(this.emailValue).subscribe(data => console.log('You just sent an invitation to: ', data));
  }

  goToFilteredCases(tag: Technology) {
    this.caseFilterService.updateFilters({
      search: '',
      caseTypes: [],
      companies: [],
      technologies: [tag],
    });

    this.router.navigateByUrl('/cases');
  }

  isAdmin() {
    const user = this.authService.user;
    if (user) {
      return this.authService.role === 'admin';
    } else {
      return false;
    }
  }

  ngOnDestroy() {}
}
