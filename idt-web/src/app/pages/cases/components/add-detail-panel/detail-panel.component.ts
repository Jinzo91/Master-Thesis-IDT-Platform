import { Component, OnInit, Input, ViewChild, AfterContentInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'idt-detail-panel',
  templateUrl: './detail-panel.component.html',
  styleUrls: ['./detail-panel.component.scss']
})
export class TransformationalDetailPanelComponent implements AfterContentInit {

  @Input() title: string;
  @Input() description: string;
  // Future input fields of the particular transformation details
  @Input() fields: [];
  @ViewChild(MatExpansionPanel, {static: true}) expansionPanel: MatExpansionPanel;

  ngAfterContentInit() {
    this.expansionPanel.open();
  }
}
