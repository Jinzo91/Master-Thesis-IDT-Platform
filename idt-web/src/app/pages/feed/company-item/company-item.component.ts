import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Company, Industries } from 'src/app/shared/models/company.model';
import { Router } from '@angular/router';

@Component({
  selector: 'idt-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss']
})
export class CompanyItemComponent implements OnInit {

  @Input('company') company: Company;
  logo;
  industries = Industries;
  following: boolean = false;
  loading: boolean = false;

  @Output() followCompany: EventEmitter<any> = new EventEmitter<any>();
  @Output() unfollowCompany: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  defaultImage(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  }

  onCompanyClick(event) {
    event.stopPropagation();
    this.router.navigate(['/companies', this.company.id]);
  }

  onFollowCompany(event) {
    event.stopPropagation();
    this.followCompany.emit(this.company.id);
    this.following = true;
  }

  onUnfollowCompany(event) {
    event.stopPropagation();
    this.unfollowCompany.emit(this.company.id);
    this.following = false;
  }
}
