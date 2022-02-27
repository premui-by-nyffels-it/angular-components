import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiDate } from './date.component';

describe('PremuiDate', () => {
  let component: PremuiDate;
  let fixture: ComponentFixture<PremuiDate>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiDate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
