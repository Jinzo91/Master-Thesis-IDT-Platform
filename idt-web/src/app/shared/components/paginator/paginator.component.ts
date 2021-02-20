import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { merge, Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'idt-app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})

export class PaginatorComponent implements OnInit, OnDestroy {

  @Input() pageSizeOptions: number[];
  @Input() pageSize: number;
  @Input('currentPage') currentPage$: Observable<number>;
  @Input('length') length$: Observable<number>;

  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  previousIndexes$ = new Observable<number[]>();
  nextIndexes$ = new Observable<number[]>();

  constructor() { }

  ngOnInit() {
    this.currentPage$.pipe(untilDestroyed(this)).subscribe(value => this.paginator.pageIndex = value - 1);

    this.previousIndexes$ = merge(
      this.currentPage$
        .pipe(
          map(page => page - 1)
        ),
      this.page
        .pipe(
          map(page => page.pageIndex)
        )
    ).pipe(
      map(pageIndex => Array(3)
        .fill(pageIndex)
        .map((val, i) => val - (3 - i))
        .filter(value => value >= 0)
      ),
    );

    this.nextIndexes$ = combineLatest(
      merge(
        this.currentPage$.pipe(map(page => page - 1)),
        this.page.pipe(map(page => page.pageIndex))
      ),
      this.length$
    ).pipe(
      withLatestFrom(this.page.asObservable()
        .pipe(startWith({ pageSize: this.pageSize }))
      ),
      map(([[pageIndex, length], pageEvent]) => Array(3)
        .fill(pageIndex)
        .map((val, i) => pageIndex + i + 1)
        .filter(value => value < (pageEvent.pageSize ? (length / pageEvent.pageSize) : 0))
      ),
    );
  }

  onClick(pageIndex) {
    this.paginator.pageIndex = pageIndex;

    const event = new PageEvent();
    event.pageIndex = pageIndex;
    event.pageSize = this.paginator.pageSize;
    this.paginator.page.emit(event);
  }

  ngOnDestroy() { }
}
