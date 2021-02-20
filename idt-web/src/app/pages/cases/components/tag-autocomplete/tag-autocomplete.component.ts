import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, combineLatest } from 'rxjs';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Technology } from 'src/app/shared/models/case.model';


@Component({
  selector: 'idt-tag-autocomplete',
  templateUrl: './tag-autocomplete.component.html',
  styleUrls: ['./tag-autocomplete.component.scss']
})
export class TagAutocompleteComponent implements OnInit {

  @Input('allTags')
  allTags$: Observable<Technology[]>;

  @Input()
  selectedTags: string[];

  tags: string[] = [];
  inputControl = new FormControl();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredTags$: Observable<Technology[]>;

  @Output() tagAdded = new EventEmitter<Partial<Technology>>();
  @Output() tagRemoved = new EventEmitter<Partial<Technology>>();

  @ViewChild('techInput', { static: false }) techInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() { }

  ngOnInit() {
    if (this.selectedTags) {
      this.tags = this.selectedTags;
    }

    this.filteredTags$ = combineLatest(
      this.inputControl.valueChanges.pipe(startWith(null)),
      this.allTags$
    ).pipe(
      map(([controlValue, tags]) => controlValue ? this._filter(controlValue, tags) : tags),
    );
  }

  add(event: MatChipInputEvent): void {

    // Add tags only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      
      // does the tag already exist
      if (this.tags.some(tag => tag.match(new RegExp(value, 'i')))) {
        return;
      }

      if ((value || '').trim()) {
        this.tags.push(value.trim());
        this.tagAdded.emit({ name: value});
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.inputControl.setValue(null);
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagRemoved.emit({name: tag});
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.tags.some(tag => tag.match(new RegExp(event.option.viewValue, 'i')))) {
      return;
    }

    this.tags.push(event.option.viewValue);
    this.techInput.nativeElement.value = '';
    this.tagAdded.emit({ id: event.option.value, name: event.option.viewValue });
    this.inputControl.setValue(null);
  }

  private _filter(value: string, tags: Technology[]): Technology[] {
    return tags.filter(tag => tag.name.match(new RegExp(value, 'i')));
  }
}
