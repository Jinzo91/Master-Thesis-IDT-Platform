import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardNewComponent } from './dashboard-new.component';
import { NumberCardComponent } from './number-card/number-card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardNewRoutingModule } from './dashboard-new.routing.module';
import { HorizontalBarChartComponent } from './horizontal-bar-chart/horizontal-bar-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [DashboardNewComponent, NumberCardComponent, HorizontalBarChartComponent, VerticalBarChartComponent, GaugeChartComponent, PieChartComponent, LineChartComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    DashboardNewRoutingModule,
    MaterialModule
  ]
})
export class DashboardNewModule { }
