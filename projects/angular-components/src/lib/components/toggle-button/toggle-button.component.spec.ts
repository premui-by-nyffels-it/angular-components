import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiToggle } from './toggle.component';

describe('PremuiToggle', () => {
  let component: PremuiToggle;
  let fixture: ComponentFixture<PremuiToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiToggle ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
