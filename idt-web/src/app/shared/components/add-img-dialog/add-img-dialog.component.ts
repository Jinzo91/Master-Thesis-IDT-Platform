import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';

export interface DialogData {
  imgFile: File;
}

@Component({
  selector: 'idt-add-img-dialog',
  templateUrl: './add-img-dialog.component.html',
  styleUrls: ['./add-img-dialog.component.scss']
})
export class AddImgDialogComponent implements OnInit {

  imgString$: Subject<any> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<AddImgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.data.imgFile);
    fileReader.onloadend = (e) => {
      this.imgString$.next(fileReader.result);
    };
  }
}
