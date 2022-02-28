import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiSmartTable } from './smart-table.component';

describe('PremuiSmartTable', () => {
  let component: PremuiSmartTable;
  let fixture: ComponentFixture<PremuiSmartTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiSmartTable ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSmartTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
