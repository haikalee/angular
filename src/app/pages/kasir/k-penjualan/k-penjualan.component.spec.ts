import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KPenjualanComponent } from './k-penjualan.component';

describe('KPenjualanComponent', () => {
  let component: KPenjualanComponent;
  let fixture: ComponentFixture<KPenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KPenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
