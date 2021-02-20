import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Technology } from 'src/app/shared/models/case.model';
import { Router } from '@angular/router';

export interface CaseCard {
  id: string;
  title: string;
  description: string;
  tags: Technology[];
  creationDate: string;
  image: string;
  company: string;
}

@Component({
  selector: 'idt-case-card',
  templateUrl: './case-card.component.html',
  styleUrls: ['./case-card.component.scss'],
  host: {
   '[class.idt-case-card]': 'true',
   '(click)': 'goToDetails(case.id)'
  }
})
export class CaseCardComponent {

  @Input() case: CaseCard;
  @Output() technologyClicked = new EventEmitter<Technology>();

  constructor(
    private router: Router
  ) { }

  goToDetails(caseId: string) {
    this.router.navigateByUrl(`/cases/${caseId}`);
  }

  tagClicked(event: MouseEvent, tag: Technology) {
    event.stopImmediatePropagation();
    this.technologyClicked.next(tag);
  }
}
