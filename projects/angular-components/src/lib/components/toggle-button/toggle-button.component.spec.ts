import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiToggleButton } from './toggle-button.component';

describe('PremuiToggleButton', () => {
  let component: PremuiToggleButton;
  let fixture: ComponentFixture<PremuiToggleButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiToggleButton ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiToggleButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
