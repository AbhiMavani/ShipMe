import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShipmentComponent } from './manage-shipment.component';

describe('ManageShipmentComponent', () => {
  let component: ManageShipmentComponent;
  let fixture: ComponentFixture<ManageShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
