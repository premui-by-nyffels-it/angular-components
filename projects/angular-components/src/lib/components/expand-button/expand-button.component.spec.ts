import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiExpandButton } from './expand-button.component';

describe('PremuiExpandButton', () => {
  let component: PremuiExpandButton;
  let fixture: ComponentFixture<PremuiExpandButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiExpandButton ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiExpandButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
