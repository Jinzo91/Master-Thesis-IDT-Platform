import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationalDetailPanelComponent } from './detail-panel.component';

describe('TransformationalDetailPanelComponent', () => {
  let component: TransformationalDetailPanelComponent;
  let fixture: ComponentFixture<TransformationalDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationalDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationalDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
