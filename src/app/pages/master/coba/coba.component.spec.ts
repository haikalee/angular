import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobaComponent } from './coba.component';

describe('CobaComponent', () => {
  let component: CobaComponent;
  let fixture: ComponentFixture<CobaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
