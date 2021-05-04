import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KPembelianComponent } from './k-pembelian.component';

describe('KPembelianComponent', () => {
  let component: KPembelianComponent;
  let fixture: ComponentFixture<KPembelianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KPembelianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
