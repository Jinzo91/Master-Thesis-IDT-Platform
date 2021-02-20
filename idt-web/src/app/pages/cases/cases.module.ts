import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { CasesRoutingModule } from './cases.routing.module';
import { CaseDetailComponent, DeleteCommentDialogComponent, EditCommentDialogComponent } from './pages/case-detail/case-detail.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaseAddComponent } from './pages/case-add/case-add.component';
import { CaseOverviewComponent } from './pages/case-overview/case-overview.component';
import { TransformationalDetailPanelComponent } from './components/add-detail-panel/detail-panel.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { TagAutocompleteComponent } from './components/tag-autocomplete/tag-autocomplete.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectFilterComponent } from './components/select-filter/select-filter.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { CreateCaseComponent } from './components/create-case-dialog/create-case-dialog.component';
import { AddSourceDialog } from './components/add-source-dialog/add-source-dialog.component';

@NgModule({
  declarations: [
    CaseOverviewComponent,
    CaseDetailComponent,
    CaseAddComponent,
    TransformationalDetailPanelComponent,
    CaseListComponent,
    TagAutocompleteComponent,
    SelectFilterComponent,
    CreateCaseComponent,
    AddSourceDialog,
    DeleteCommentDialogComponent,
    EditCommentDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    CasesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMatSelectSearchModule,
    GoogleChartsModule
  ],
  exports: [
    CaseListComponent
  ],
  entryComponents: [
    CreateCaseComponent,
    DeleteCommentDialogComponent,
    EditCommentDialogComponent,
    AddSourceDialog
  ]
})
export class CasesModule { }
