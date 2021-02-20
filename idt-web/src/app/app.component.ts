import { Component } from '@angular/core';
import {RoutingStateService} from './services/routing-state.service';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'idt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  removeMarginForDashboard = false;

  constructor(
    private routingStateService: RoutingStateService,
    private dashboardService: DashboardService
  ) {
    this.routingStateService.loadRouting();
  }

  ngOnInit(): void {
    this.dashboardService.getRemoveMarginForDashboard().subscribe(removeMarginForDashboard => this.removeMarginForDashboard = removeMarginForDashboard);
  }
}
