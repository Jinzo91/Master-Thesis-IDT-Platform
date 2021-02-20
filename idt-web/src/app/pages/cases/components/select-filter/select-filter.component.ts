import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { first, take } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'idt-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  items: any[];
  selectedValueControl: FormControl = new FormControl();
  filterControl: FormControl = new FormControl();
  filteredItems$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchString = '';

  @Input() label: string = 'Field label';
  @Input('items') items$: Observable<any[]>;
  @Input() formControl: FormControl;

  // array of the selected id-s
  @Output() valueChange = new EventEmitter<number[]>();
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  ngOnInit() {
    this.items$.pipe(first(), untilDestroyed(this)).subscribe(items => {
      // TODO: sort in BE
      this.items = items.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredItems$.next(items);
    });

    // listen for search field value changes
    this.filterControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.filterItemsMulti();
      });

    this.filterControl.valueChanges.pipe(untilDestroyed(this)).subscribe(data => this.searchString = data);

    this.selectedValueControl.valueChanges.pipe(untilDestroyed(this)).subscribe(
      change => {
        this.valueChange.emit(change);
      }
    );
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() { }

  /**
   * Sets the initial value after the filtered items are loaded initially
   */
  protected setInitialValue() {
    this.filteredItems$
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterItemsMulti() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.filterControl.value;
    if (!search) {
      this.filteredItems$.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the items
    this.filteredItems$.next([]);
    this.filteredItems$.next(
      this.items.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
