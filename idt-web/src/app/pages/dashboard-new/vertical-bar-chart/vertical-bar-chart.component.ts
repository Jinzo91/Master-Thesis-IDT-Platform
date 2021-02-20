import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'idt-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss']
})
export class VerticalBarChartComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() xAxisLabel = '';

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  yAxisLabel = 'Number of Cases';

  colorScheme = {
    domain: ['#E1ECFE', '#D1E2FD', '#C2D8FC', '#B3CFFB', '#A4C5FB', '#94BBFA', '#84B0F9', '#5895F7', '#2A78F5', '#0B5EE4']
  };


  constructor() { }

  ngOnInit() {
  }

  yAxisTickFormatting(val: number) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }
}
