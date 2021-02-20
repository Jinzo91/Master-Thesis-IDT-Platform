import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutIdtComponent } from './about-idt.component';

describe('AboutIdtComponent', () => {
  let component: AboutIdtComponent;
  let fixture: ComponentFixture<AboutIdtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutIdtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutIdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
