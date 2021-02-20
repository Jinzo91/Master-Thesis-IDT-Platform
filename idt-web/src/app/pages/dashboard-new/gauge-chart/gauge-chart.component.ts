import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'idt-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GaugeChartComponent implements OnInit {

  legend: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#E1ECFE', '#D1E2FD', '#C2D8FC', '#B3CFFB', '#A4C5FB', '#94BBFA', '#84B0F9', '#5895F7', '#2A78F5', '#0B5EE4']
  };

  data = [{
    name: 'Product Launch',
    value: 1
  },
  {
    name: 'Internal Initiative',
    value: 5
  },
  {
    name: 'Founding/Carve Out',
    value: 2
  },
  {
    name: 'Cooperation',
    value: 1
  },
  {
    name: 'Other',
    value: 625
  }];

  constructor() { }

  ngOnInit() {
  }
}
