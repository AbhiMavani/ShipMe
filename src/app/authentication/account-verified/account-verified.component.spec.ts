import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifiedComponent } from './account-verified.component';

describe('AccountVerifiedComponent', () => {
  let component: AccountVerifiedComponent;
  let fixture: ComponentFixture<AccountVerifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountVerifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
