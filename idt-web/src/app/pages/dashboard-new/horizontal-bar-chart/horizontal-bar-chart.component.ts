import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'idt-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit {

  @Input() data: any[] = [];

  single: any[];

  colorScheme = {
    domain: ['#E1ECFE', '#D1E2FD', '#C2D8FC', '#B3CFFB', '#A4C5FB', '#94BBFA', '#84B0F9', '#5895F7', '#2A78F5', '#0B5EE4']
  };

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Technology';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Number of cases';

  constructor() { }

  ngOnInit() {
  }

  xAxisTickFormatting(value: number) {
    return Math.trunc(value);
  }
}
