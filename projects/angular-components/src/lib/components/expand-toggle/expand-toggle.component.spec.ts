import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiExpandToggle } from './expand-toggle.component';

describe('PremuiExpandToggle', () => {
  let component: PremuiExpandToggle;
  let fixture: ComponentFixture<PremuiExpandToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiExpandToggle ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiExpandToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
