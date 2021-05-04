import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KCustomerComponent } from './k-customer.component';

describe('KCustomerComponent', () => {
  let component: KCustomerComponent;
  let fixture: ComponentFixture<KCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
