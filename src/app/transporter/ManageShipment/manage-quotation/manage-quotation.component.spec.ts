import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuotationComponent } from './manage-quotation.component';

describe('ManageQuotationComponent', () => {
  let component: ManageQuotationComponent;
  let fixture: ComponentFixture<ManageQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
