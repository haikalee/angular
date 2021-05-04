import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KLaporanComponent } from './k-laporan.component';

describe('KLaporanComponent', () => {
  let component: KLaporanComponent;
  let fixture: ComponentFixture<KLaporanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KLaporanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
