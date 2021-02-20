import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private apiService: ApiService) { }

  add(mail: string): Observable<any> {
    return this.apiService.post(`${environment.apiBase}/subscribers/add`, { mail });
  }

  activate(hash: string): Observable<any> {
    return this.apiService.get(`${environment.apiBase}/subscribers/activate/${hash}`);
  }

  unsubscribe(hash: string): Observable<any> {
    return this.apiService.get(`${environment.apiBase}/subscribers/unsubscribe/${hash}`);
  }
}
