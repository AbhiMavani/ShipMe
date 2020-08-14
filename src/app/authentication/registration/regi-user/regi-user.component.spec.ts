import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegiUserComponent } from './regi-user.component';

describe('RegiUserComponent', () => {
  let component: RegiUserComponent;
  let fixture: ComponentFixture<RegiUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegiUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
