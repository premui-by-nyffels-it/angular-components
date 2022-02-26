import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiButton } from './button.component';

describe('PremuiButton', () => {
  let component: PremuiButton;
  let fixture: ComponentFixture<PremuiButton>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiButton ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
