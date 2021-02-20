import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { Case } from 'src/app/shared/models/case.model';
import { CompanyService } from 'src/app/services/company.service';
import { Industries } from 'src/app/shared/models/company.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'idt-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit, AfterViewInit {

  @Input('case') case: Case;
  @Input('suggested') suggested?: boolean = false;
  image;
  logo;
  industries = Industries;
  @ViewChild('feedDescription', {static: false}) feedDescription: ElementRef;
  isDescriptionOverflowing: boolean;
  isExpanded: boolean;

  @Output() unfollowCompany: EventEmitter<any> = new EventEmitter();
  @Output() followCompany: EventEmitter<any> = new EventEmitter();

  constructor(
    private caseService: CaseService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
    this.image = this.caseService.getImage(this.case.id) + '?' + new Date().getTime();
    this.companyService.getLogo(this.case.company.id);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isDescriptionOverflowing = this.feedDescription.nativeElement.scrollHeight > 200);
  }

  onCaseClick() {
    this.router.navigate(['/cases', this.case.id]);
  }

  onToggleExpand(event) {
    event.stopPropagation()
    if (this.feedDescription.nativeElement.scrollHeight > 200 && !this.isExpanded) {
      this.feedDescription.nativeElement.classList.add('is-expanded');
      this.isExpanded = true;
    } else {
      this.feedDescription.nativeElement.classList.remove('is-expanded');
      this.isExpanded = false;
    }
  }

  defaultImage(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  }

  onShareCaseLink(event) {
    event.stopPropagation();
    const windowUrl = window.location.href.split('/');
    windowUrl.pop();
    const caseUrl = windowUrl.join('/') + '/cases/' + this.case.id;
    navigator.clipboard.writeText(caseUrl);
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'info',
        message: 'Case URL copied to clipboard!'
      }
    });
  }

  onCompanyClick(event) {
    event.stopPropagation();
    this.router.navigate(['/companies', this.case.company.id]);
  }

  onUnfollowCompany(event) {
    event.stopPropagation();
    this.unfollowCompany.emit(this.case.company.id);
    this.suggested = true;
  }

  onFollowCompany(event) {
    event.stopPropagation();
    this.followCompany.emit(this.case.company.id);
    this.suggested = false;
  }
}
