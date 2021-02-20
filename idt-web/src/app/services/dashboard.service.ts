import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private removeMarginForDashboard: Subject<boolean> = new Subject();

  onRemoveMarginForDashboard(removeMarginForDashboard: boolean) {
    this.removeMarginForDashboard.next(removeMarginForDashboard);
  }

  getRemoveMarginForDashboard(): Observable<boolean> {
    return this.removeMarginForDashboard.asObservable();
  }
}
