import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DofficeSelect } from './select.component';

describe('DofficeSelect', () => {
  let component: DofficeSelect;
  let fixture: ComponentFixture<DofficeSelect>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DofficeSelect ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DofficeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
