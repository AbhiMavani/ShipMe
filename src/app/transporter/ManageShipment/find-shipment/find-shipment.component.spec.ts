import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindShipmentComponent } from './find-shipment.component';

describe('FindShipmentComponent', () => {
  let component: FindShipmentComponent;
  let fixture: ComponentFixture<FindShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
