import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
@Component({
  selector: 'idt-loader',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoaderComponent {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
}
