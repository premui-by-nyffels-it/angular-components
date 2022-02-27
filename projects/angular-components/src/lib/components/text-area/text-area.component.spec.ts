import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiInput } from './input.component';

describe('PremuiInput', () => {
  let component: PremuiInput;
  let fixture: ComponentFixture<PremuiInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiInput ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
