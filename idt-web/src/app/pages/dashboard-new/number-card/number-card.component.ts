import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'idt-number-card',
  templateUrl: './number-card.component.html',
  styleUrls: ['./number-card.component.scss']
})
export class NumberCardComponent implements OnInit {

  colorScheme = {
    domain: ['#16c11e', '#f74d2f']
  };
  cardColor: string = '#213775';
  data = [{
    name: 'Cases',
    value: '619'
  },
  {
    name: 'Companies',
    value: '784'
  }];

  constructor() { }

  ngOnInit() {
  }
}
