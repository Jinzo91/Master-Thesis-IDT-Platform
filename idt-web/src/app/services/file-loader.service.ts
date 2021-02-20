import {Injectable} from '@angular/core';
import {ToasterComponent} from '../shared/components/toaster/toaster.component';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class FileLoaderService {

  fileExtension = new Map([
    ['image' , /\.(png|PNG|jpg|JPG|jpeg|JPEG|svg|SVG|gif|GIF|bmp|BMP)$/]
  ]);

  constructor(
    public snackBar: MatSnackBar
  ) {}

  uploadFile(event: File[], fileExt: string, minSize: number, maxSize: number) {
    for (const file of event) {
      if (file.name.match(this.fileExtension.get(fileExt))) {
        if (file.size > minSize && file.size < maxSize) {
          return file;
        } else {
          this.snackBar.openFromComponent(ToasterComponent, {
            data: {
              type: 'error',
              message: `Wrong image size. It must be between ${minSize} and ${maxSize / 1000000} MB`
            }
          });
        }
      }
    }
  }
}
