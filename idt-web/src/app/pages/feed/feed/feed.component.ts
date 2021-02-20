import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service.ts.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Case } from 'src/app/shared/models/case.model';
import { Router } from '@angular/router';
import { Company } from 'src/app/shared/models/company.model';

@Component({
  selector: 'idt-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {


  personalFeedCases: Case[] = [];
  suggestedCompanies: Company[] = [];
  suggestedCases: Case[] = [];

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.userService.getPersonalFeed(this.authService.user.id).subscribe(data => this.personalFeedCases = data);
    this.userService.getSuggestedCompanies(this.authService.user.id).subscribe(data => this.suggestedCompanies = data);
    this.userService.getSuggestedCases(this.authService.user.id).subscribe(data => this.suggestedCases = data);
  }

  onUnfollowCompany(event) {
    const userId = this.authService.user.id;
    this.userService.unfollowCompany(userId, event).subscribe(() => {
      this.personalFeedCases = this.personalFeedCases.filter(c => c.company.id !== event);
      this.userService.getSuggestedCases(this.authService.user.id).subscribe(data => this.suggestedCases = data);
    });
  }

  onFollowCompany(event) {
    const userId = this.authService.user.id;
    this.userService.followCompany(userId, event).subscribe(() => {
      this.personalFeedCases = this.personalFeedCases.concat(this.suggestedCases.filter(c => c.company.id === event));
      this.userService.getSuggestedCases(this.authService.user.id).subscribe(data => this.suggestedCases = data.filter(c => c.company.id !== event));
    });
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  onRefreshSuggestedCompanies() {
    this.userService.getSuggestedCompanies(this.authService.user.id).subscribe(data => this.suggestedCompanies = data);
  }
}
