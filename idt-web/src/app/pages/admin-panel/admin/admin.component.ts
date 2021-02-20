/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, throwError, EMPTY } from 'rxjs';
import { InvitationService } from 'src/app/services/invitation.service';
import {ToasterComponent} from '../../../shared/components/toaster/toaster.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'idt-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private _destroyed: Subject<void> = new Subject();

  emailValue = '';

  constructor(
    private invitationService: InvitationService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  invite() {
    this.invitationService.inviteUser(this.emailValue).subscribe(data => {
    this.showSnackbar('You successfully sent the invitation!', 'Close', 'success')},
      err => {console.error('You just sent an invitation to: ', err);
      this.showSnackbar('Error: Invitation not send!', 'Close', 'error');
    });
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }
}
