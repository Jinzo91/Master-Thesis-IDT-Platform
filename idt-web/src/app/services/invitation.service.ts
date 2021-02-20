import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private apiService: ApiService) { }

  inviteUser(mail: string): Observable<any> {
    return this.apiService.post(`${environment.apiBase}/signup/invite`, { mail });
  }
}
