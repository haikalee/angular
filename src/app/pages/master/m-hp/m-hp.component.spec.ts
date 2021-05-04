import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MHpComponent } from './m-hp.component';

describe('MHpComponent', () => {
  let component: MHpComponent;
  let fixture: ComponentFixture<MHpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MHpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MHpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
