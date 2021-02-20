import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CaseService } from 'src/app/services/case.service';
import { Observable, ReplaySubject, Observer, BehaviorSubject, Subject, merge, of } from 'rxjs';
import { Case, Source, SOURCE_ICONS, Technology, SourceType, Comment} from 'src/app/shared/models/case.model';
import { CompanyService, CompaniesPageResponse } from 'src/app/services/company.service';
import { Company } from 'src/app/shared/models/company.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData, AddImgDialogComponent } from '../../../../shared/components/add-img-dialog/add-img-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterComponent } from 'src/app/shared/components/toaster/toaster.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';
import { FileLoaderService } from '../../../../services/file-loader.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {filter, tap, startWith, map, switchMap, share} from 'rxjs/operators';
import { dynamicSearch } from 'src/app/shared/operators/dynamic-search';
import { ConfirmQuitDialogComponent } from 'src/app/shared/components/confirm-quit-dialog/confirm-quit-dialog.component';
import { CaseFilterService } from 'src/app/services/case-filter.service';
import { AddSourceDialog } from '../../components/add-source-dialog/add-source-dialog.component';
import { extension } from 'mime-types';
import { CustomIconService } from '../../../../services/custom-icon.service';
import { Location } from '@angular/common';

export interface EditCommentDialogData {
  comment: string;
}
@Component({
  selector: 'idt-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  image = './../../../../../assets/geom.jpg';

  allTechnologies$: Observable<Technology[]>;
  caseTechnologies: string[] = [];
  case: Case;
  comments: Comment[] = [];
  editingComment: boolean = false;
  userId: string;
  editing: boolean = false;
  mouseOverImg: boolean = false;
  submitLabel: string = 'Save changes';
  backLabel: string = 'Go back';
  serverSideFilteringCtrl: FormControl = new FormControl();
  filteredServerSideCompanies$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  isSearchingForCompanies: boolean = false;

    // Source Variables
    urlSourceList$: Observable<Source[]>;
    fileSourceList$: Observable<Source[]>;
    sourcesUpdated$ = new Subject<Source[]>();
    sourcesLoaded$ = new BehaviorSubject<boolean>(false);
    sourcesEmpty$ = new BehaviorSubject<boolean>(true);
    fileDisplayedColumns = ['image', 'file', 'description', 'uploadAt'];
    urlDisplayedColumns = ['title', 'url','description'];
    sourceType = SourceType;


  companies: Partial<Company>[];
  caseEditForm: FormGroup;

  dialogData: DialogData = {
    imgFile: null,
  };

  @ViewChild('caseDescription', { static: false }) caseDescription: ElementRef<HTMLDivElement>;
  @ViewChild('comment', {static: false}) comment: ElementRef<HTMLInputElement>;

  descriptionMaxLength = 4000;
  descriptionExpansionLabel: string = 'Read more';
  descriptionExpanded: boolean = false;
  isDescriptionTooLong: boolean = false;
  descriptionLengthRemaining$: Observable<number>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private caseService: CaseService,
    private companyService: CompanyService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fileLoader: FileLoaderService,
    private caseFilterService: CaseFilterService,
    private customIconService: CustomIconService,
    private location: Location
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.getCurrentNavigation().extras.state),
      filter(state => state && state.edit),
      tap(() => this.toggleEdit()),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnInit() {
    this.userId = this.authService.user !== null ? this.authService.user.id : null;

    this.case = this.activatedRoute.snapshot.data.case;
    this.caseTechnologies = this.case.technologies.map(tech => tech.name);

    this.image = this.caseService.getImage(this.case.id) + '?' + new Date().getTime();

    this.allTechnologies$ = this.caseService.getAllTechnologies();

    this.caseEditForm = new FormGroup({
      title: new FormControl({
        value: this.case.title,
        disabled: true,
      }, Validators.required),
      description: new FormControl({
        value: this.case.description,
        disabled: true
      }, Validators.required),
      company: new FormControl({
        value: this.case.company.id,
        disabled: true
      }),
      logo: new FormControl({
        value: this.companyService.getLogo(this.case.company.id),
        disabled: true
      }),
      url: new FormControl({
        value: this.case.url,
        disabled: true
      }),
      featured: new FormControl({
        value: this.case.featured,
        disabled: true
      }),
    });

    this.descriptionLengthRemaining$ = this.caseEditForm.controls.description.valueChanges
      .pipe(
        startWith(this.caseEditForm.controls.description.value),
        map(value => this.descriptionMaxLength - value.length),
      );

    this.filteredServerSideCompanies$.next([this.case.company]);

    this.serverSideFilteringCtrl.valueChanges
      .pipe(
        startWith(''),
        filter(search => !!search),
        tap(() => this.isSearchingForCompanies = true),
        untilDestroyed(this),
        dynamicSearch<string, CompaniesPageResponse>(search =>
          this.companyService.getCompanies({ search: (search as string).trim(), pageSize: 100 })
            )).subscribe(response => {
                this.isSearchingForCompanies = false;
                this.filteredServerSideCompanies$.next(response.data);
              });

          const sourceList$ = merge(
            this.caseService.getSources(this.case.id),
            this.sourcesUpdated$
          ).pipe(
            untilDestroyed(this),
            tap(sources => {
              this.sourcesLoaded$.next(true);
              this.sourcesEmpty$.next(sources.length === 0);
            }),
            share(),
          );

    this.fileSourceList$ = sourceList$.pipe(
      map(sources => sources.filter(source => source.file))
    );

    this.urlSourceList$ = sourceList$.pipe(
      map(sources => sources.filter(source => !source.file))
    );

    this.customIconService.init();

    this.caseService.getComments(this.case.id).subscribe(data =>  this.comments = data);

  }

  ngAfterViewInit() {
    setTimeout(() => this.isDescriptionTooLong = this.caseDescription.nativeElement.scrollHeight > 500);
  }

  ngOnDestroy() { }

  toggleEdit() {
    this.editing = !this.editing;

    if (this.editing) {
      this.caseEditForm.enable();
      this.fileDisplayedColumns = ['image', 'file', 'description', 'uploadAt', 'delete'];
      this.urlDisplayedColumns = ['title', 'url','description', 'delete'];
    } else {
      this.fileDisplayedColumns = ['image', 'file', 'description', 'uploadAt'];
      this.urlDisplayedColumns = ['title', 'url','description'];
      this.caseEditForm.disable();
      this.submitForm();
    }
  }

  submitForm() {
    this.caseService.updateCase(
      this.case.id,
      {
        title: this.caseEditForm.controls.title.value,
        description: this.caseEditForm.controls.description.value,
        company: this.caseEditForm.controls.company.value,
        url: this.caseEditForm.controls.url.value,
        featured: this.caseEditForm.controls.featured.value,
        disabled: this.case.disabled,
        caseType: this.case.caseType
      }
    ).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.showSnackbar('You successfully updated the case!', 'Close', 'success');
        this.case = data;
        this.caseTechnologies = this.case.technologies.map(tech => tech.name);
        this.isDescriptionTooLong = this.caseDescription.nativeElement.scrollHeight > 500;
      },
      error => this.showSnackbar(error.message, 'Close', 'error')
    );
  }

  showSnackbar(message: string, action: string, type: string) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {
        type,
        message
      }
    });
  }

  editingAllowed() {
    const user = this.authService.user;
    if (user) {
      return this.authService.role === 'admin' || this.case.createdBy.id === user.id;
    } else {
      return false;
    }
  }

  isAdmin() {
    const user = this.authService.user;
    if (user) {
      return this.authService.role === 'admin';
    } else {
      return false;
    }
  }

  onBack() {
    this.location.back();
  }

  getSourceIcon(contentType) {
        return contentType
          ? SOURCE_ICONS
          .filter(source => source.contentType === contentType)
          .map(source => source.icon)[0] || 'file.svg'
          : 'file.svg';
      }

      getSourceFile(sourceId) {
        return this.caseService.getSourceFile(this.case.id, sourceId);
      }

      getSourceFileName(source: Source) {
        const ext = source.file ? extension(source.file.contentType) : '';
        return ext ? `${source.title}.${ext}` : source.title;
      }

      openAddSourceModal(sourceType: SourceType) {
        const dialogRef = this.dialog.open(AddSourceDialog, {
          width: '600px',
          data: sourceType
        });
        dialogRef.afterClosed()
          .pipe(
            filter(result => !!result),
            tap(() => this.sourcesLoaded$.next(false)),
            switchMap(source => this.caseService.addSource(this.case.id, source)
                .pipe(
                  map(value => { value.file = source.file; return value; }),
                  switchMap(value => value.file ? this.caseService.addSourceFile(this.case.id, value.id, value.file) : of(value)),
                )
            ),
            switchMap(() => this.caseService.getSources(this.case.id)),
          ).subscribe(
          result => {
            this.showSnackbar('You successfully added a Source!', 'Close', 'success');
            this.sourcesUpdated$.next(result);
          },
          () => {
            this.sourcesLoaded$.next(true);
            this.showSnackbar('Source couldn\'t be saved', 'Close', 'error');
          }
        );
      }


  cancel() {
    if (this.editing) {
      this.editing = false;
      this.caseEditForm.disable();
    }
  }

  getCompanyUrl(id: string) {
    return '/companies/'  + id;
  }

  defaultImage() {
    this.caseEditForm.controls.logo.patchValue('https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
  }

  disableCase() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: 'case'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.caseService.deleteCase(this.case.id)
          .pipe(untilDestroyed(this))
          .subscribe(
            data => {
              this.showSnackbar('You successfully disabled the case!', 'Close', 'success');
              setTimeout(() => this.router.navigate(['/cases'], { replaceUrl: true }), 300);
            },
            error => this.showSnackbar(error.message, 'Close', 'error')
          );
      }
    });
  }

  enableCase() {
    this.caseService.enableCase(this.case.id)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully enabled the case!', 'Close', 'success');
          this.case.disabled = false;
        },
        error => this.showSnackbar(error.message, 'Close', 'error')
      );
  }

  toggleDescriptionExpansion() {
    if (this.descriptionExpanded) {
      this.caseDescription.nativeElement.classList.remove('is-expanded');
    } else {
      this.caseDescription.nativeElement.classList.add('is-expanded');
    }
    this.descriptionExpanded = !this.descriptionExpanded;
    this.descriptionExpansionLabel = this.descriptionExpansionLabel === 'Read more' ? 'Hide' : 'Read more';

  }

  getTagNames() {
    return this.case.technologies ? this.case.technologies.map(tech => tech.name) : [];
  }

  addTag(tag: Partial<Technology>) {
    this.caseService.addTechnology(this.case.id, tag)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => console.log(data),
        error => this.showSnackbar(error.message, 'Close', error));
  }

  removeTag(tag: Partial<Technology>) {
    const tagIdToRemove = this.case.technologies.find(tech => tech.name === tag.name).id;
    this.caseService.removeTechnology(this.case.id, tagIdToRemove)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => { },
        error => this.showSnackbar(error.message, 'Close', error)
      );
  }

  uploadImage(files) {
    // File size between 0 and 5MB
    this.dialogData.imgFile = this.fileLoader.uploadFile(files, 'image', 0, 5000000);
    if (this.dialogData.imgFile) {
      const dialogRef = this.dialog.open(AddImgDialogComponent, {
        width: '750px',
        data: this.dialogData
      });

      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(data => {
        if (data) {
          // TODO: Define how image works (default, loaded, etc)
          this.caseService.updateImage(this.case.id, this.dialogData.imgFile).subscribe(
            val => {
              this.image = this.caseService.getImage(this.case.id) + '?' + new Date().getTime();
              this.showSnackbar('You successfully updated the case\'s image!', 'Close', 'success');
            },
            error => this.showSnackbar(error.message, 'Close', 'error')
          );
        }
      });
    }
  }

  getAbsoluteCaseLink(link: string) {
    return link && link.startsWith('http') ? link : '//' + link;
  }

  // prevent the user from quitting without saving changes made
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.editing) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      let dialogRef = this.dialog.open(ConfirmQuitDialogComponent, {width: '450px'});

      dialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(result => {
        observer.next(result);
        observer.complete();
      }, (error) => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  goToFilteredCasePage(tag: Technology) {
    this.caseFilterService.updateFilters({
      search: '',
      caseTypes: [],
      companies: [],
      technologies: [tag],
    });

    this.router.navigateByUrl('/cases');
  }

  onAddCase(event, row) {
    this.caseService.updateCase(
      this.case.id,
      {createdBy: this.authService.user}
      ).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.showSnackbar('You successfully added a case!', 'Close', 'success');
          this.onBack();
        },
        error => this.showSnackbar('We could not change this data!', 'Close', 'error')
      );
  }

  deleteSource(row: any, file: boolean) {
    if (file) {
      this.caseService.deleteSourceFile(this.case.id, row.id)
      .pipe(untilDestroyed(this))
        .subscribe(
          (data) => {
            this.sourcesUpdated$.next(data);
          },
          error => this.showSnackbar(error.message, 'Close', error)
        );
      } else {
        this.caseService.deleteSourceFile(this.case.id, row.id)
        .pipe(untilDestroyed(this))
          .subscribe(
            (data) => {
              this.sourcesUpdated$.next(data);
            },
            error => this.showSnackbar(error.message, 'Close', error)
          );
    }
  }

  isLoggedIn() {
    return this.authService.user !== null;
  }

  logIn() {
    this.router.navigateByUrl('/login');
  }

  onComment(com: string) {
    const comment = {
      comment: com
    };
    this.caseService.addComment(this.case.id, comment).subscribe(data => {
      this.comments.splice(0, 0, data);
      this.comment.nativeElement.value = '';
    });
  }

  onEditComment(comment) {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '500px',
      data: comment.comment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        comment.comment = result;
        this.caseService.editComment(this.case.id, comment).subscribe(_ => null);
      } else {
        return;
      }
    });
  }

  onDeleteComment(commentId, index) {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.caseService.deleteComment(this.case.id, commentId).subscribe(_ => this.comments.splice(index, 1));
      }
    });
  }
}

@Component({
  selector: 'idt-delete-comment-dialog',
  templateUrl: './delete-comment-dialog.html',
})
export class DeleteCommentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>
  ) { }
}

@Component({
  selector: 'idt-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.html',
})
export class EditCommentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditCommentDialogData) {}
}
