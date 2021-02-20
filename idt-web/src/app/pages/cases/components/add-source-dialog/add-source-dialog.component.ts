import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FileLoaderService } from '../../../../services/file-loader.service';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SourceType } from '../../../../shared/models/case.model';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'idt-add-source-dialog',
  templateUrl: './add-source-dialog.component.html',
  styleUrls: ['./add-source-dialog.component.scss']
})
export class AddSourceDialog implements OnInit {

  sourceFormGroup: FormGroup;
  urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
  sourceType = SourceType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SourceType,
    private formBuilder: FormBuilder,
    private fileLoader: FileLoaderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sourceFormGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      url: new FormControl('https://www.example.com/', [Validators.pattern(this.urlPattern), Validators.required]), // dummy url
      file: new FormControl(null)
    }, {validator: this.sourceContentRequired()});
  }

  onFileDropped(files) {
    if (files[0].name.includes('.pdf')) {
      this.sourceFormGroup.controls.file.patchValue(
        // Max size: 50MB
        this.fileLoader.uploadFile(files, 'all', 0, 50000000)
      );
      this.sourceFormGroup.controls.title.patchValue(
        files[0].name.substring(0, files[0].name.length - 4 )
      );
    } else {
      //insert snackbar
      this.showSnackbar('Please upload a pdf-file', 'Close', 'error')
    }
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  sourceContentRequired(): ValidatorFn {
    return (group: FormGroup): {[key: string]: any} | null => {
      return (
        group.controls.url.value && !this.isFileSource()
        || group.controls.file.value && this.isFileSource()
      ) ? null
        : { contentRequired: true };
    };
  }

  isFileSource(): boolean {
    return this.data === this.sourceType.File;
  }
}


