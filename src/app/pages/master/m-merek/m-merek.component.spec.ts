import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MMerekComponent } from './m-merek.component';

describe('MMerekComponent', () => {
  let component: MMerekComponent;
  let fixture: ComponentFixture<MMerekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MMerekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MMerekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
