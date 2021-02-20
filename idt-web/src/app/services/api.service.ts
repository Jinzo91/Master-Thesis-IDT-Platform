import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { ToasterComponent } from '../shared/components/toaster/toaster.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) { }


  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url)
      .pipe(catchError(error => this.handleError(error)));
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(url, data).pipe(catchError(error => this.handleError(error)));
  }


  patch<T>(url: string, data?: any): Observable<any> {
    return this.httpClient.patch<T>(url, data, this.httpOptions).pipe(catchError(error => this.handleError(error)));
  }

  delete<T>(url: string): Observable<any> {
    return this.httpClient.delete<T>(url).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {

    switch (error.status) {
      case 401:
         if (this.router.url !== '/login') {
           this.router.navigateByUrl('/login');
         } else {
           this.showSnackBarError('Wrong credentials! Try again!');
         }
         break;
      case 404:
        // TODO: add not found page
        break;
      default:
        // inform about all other errors
        const errorText = error ?  error.message : 'We are sorry, we had an unexpected error!';
        this.showSnackBarError(errorText);
    }

    return EMPTY;
  }

  private showSnackBarError(message: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type: 'error',
        message
      }
    });
  }
}

