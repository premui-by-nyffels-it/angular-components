import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiSwitch, PremuiSwitchElement } from './switch.component';

describe('PremuiSwitch', () => {
  let component: PremuiSwitch;
  let fixture: ComponentFixture<PremuiSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiSwitch ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('PremuiSwitchElement', () => {
  let component: PremuiSwitchElement;
  let fixture: ComponentFixture<PremuiSwitchElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiSwitchElement ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSwitchElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
