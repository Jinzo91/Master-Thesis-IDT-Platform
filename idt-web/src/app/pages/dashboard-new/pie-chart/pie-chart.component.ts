import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'idt-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() data: any[] = [];

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#E1ECFE', '#D1E2FD', '#C2D8FC', '#B3CFFB', '#A4C5FB', '#94BBFA', '#84B0F9', '#5895F7', '#2A78F5', '#0B5EE4']
  };

  constructor() { }

  ngOnInit() {
  }
}
