import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayShipmentComponent } from './display-shipment.component';

describe('DisplayShipmentComponent', () => {
  let component: DisplayShipmentComponent;
  let fixture: ComponentFixture<DisplayShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
