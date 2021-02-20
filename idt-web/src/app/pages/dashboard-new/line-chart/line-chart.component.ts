import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'idt-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {


  @Input() data: any[] = [];
  @Input() showLabels?: boolean = true;
  @Input() xAxis?: boolean = true;
  @Input() yAxis?: boolean = true;
  @Input() showXAxisLabel?: boolean = true;
  @Input() showYAxisLabel?: boolean = true;
  @Input() tooltipDisabled?: boolean = false;

  // options
  legend: boolean = false;
  animations: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Amount';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#E1ECFE', '#84B0F9']
  };

  constructor() { }

  ngOnInit() {
  }
}
