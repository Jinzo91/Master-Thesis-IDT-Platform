import { Component, Input } from '@angular/core';

@Component({
  selector: 'idt-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {

  @Input() link: string = '';
  @Input() href: string;
  @Input() linkText: string;
}
