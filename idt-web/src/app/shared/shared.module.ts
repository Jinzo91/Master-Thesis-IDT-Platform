import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from '../material.module';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoaderComponent } from './components/loading/loading.component';
import { AddImgDialogComponent } from './components/add-img-dialog/add-img-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropDirective } from './directives/drag-drop.directive';
import { ToasterComponent } from './components/toaster/toaster.component';
import { LinkComponent } from './components/link/link.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { HighlightWord } from './pipes/highlight-word.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ConfirmQuitDialogComponent } from './components/confirm-quit-dialog/confirm-quit-dialog.component';
import { CreateCompanyComponent } from '../pages/companies/components/create-company-dialog/create-company-dialog.component';
import { CreateCompanyManuallyDialogComponent } from '../pages/companies/components/create-company-manually-dialog/create-company-manually-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MobileHeaderComponent,
    FooterComponent,
    ErrorPageComponent,
    LoaderComponent,
    AddImgDialogComponent,
    DragDropDirective,
    LoaderComponent,
    ToasterComponent,
    LinkComponent,
    DeleteDialogComponent,
    HighlightWord,
    PaginatorComponent,
    ConfirmQuitDialogComponent,
    CreateCompanyComponent,
    CreateCompanyManuallyDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    MobileHeaderComponent,
    FooterComponent,
    LoaderComponent,
    AddImgDialogComponent,
    LinkComponent,
    DeleteDialogComponent,
    DragDropDirective,
    HighlightWord,
    PaginatorComponent,
    ConfirmQuitDialogComponent
  ],
  entryComponents: [
    AddImgDialogComponent,
    ToasterComponent,
    DeleteDialogComponent,
    ConfirmQuitDialogComponent,
    CreateCompanyComponent,
    CreateCompanyManuallyDialogComponent
  ]
})
export class SharedModule { }
