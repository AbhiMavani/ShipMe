import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShipmentComponent } from './edit-shipment.component';

describe('EditShipmentComponent', () => {
  let component: EditShipmentComponent;
  let fixture: ComponentFixture<EditShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
