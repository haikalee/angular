import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KBarangComponent } from './k-barang.component';

describe('KBarangComponent', () => {
  let component: KBarangComponent;
  let fixture: ComponentFixture<KBarangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KBarangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
