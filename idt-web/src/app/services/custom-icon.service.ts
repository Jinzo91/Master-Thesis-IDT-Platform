import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class CustomIconService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  init() {
    this.matIconRegistry.addSvgIcon(
      'code',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/code.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'docx',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/docx.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'file',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/file.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'html',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/html.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'image',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/image.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'audio',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/audio.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'pdf',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/pdf.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ppt',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/ppt.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'txt',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/txt.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'video',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/video.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'xslx',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/xslx.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'zip',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/fileTypes/zip.svg')
    );
  }
}
