import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiCollapsible } from './collapsible.component';

describe('PremuiCollapsible', () => {
  let component: PremuiCollapsible;
  let fixture: ComponentFixture<PremuiCollapsible>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiCollapsible ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiCollapsible);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
