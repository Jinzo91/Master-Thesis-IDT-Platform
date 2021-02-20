import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'idt-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  host: {
    '[class.idt-toaster--error]': 'type === "error"',
    '[class.idt-toaster--info]': 'type === "info"',
    '[class.idt-toaster--success]': 'type === "success"'
  }
})
export class ToasterComponent {

  type: string = 'info';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.type = this.data.type;
  }
}
