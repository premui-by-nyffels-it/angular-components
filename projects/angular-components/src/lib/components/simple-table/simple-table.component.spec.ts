import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiSimpleTable } from './simple-table.component';

describe('PremuiSimpleTable', () => {
  let component: PremuiSimpleTable;
  let fixture: ComponentFixture<PremuiSimpleTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiSimpleTable ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSimpleTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
