import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiIcon } from './icon.component';

describe('PremuiIcon', () => {
  let component: PremuiIcon;
  let fixture: ComponentFixture<PremuiIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiIcon ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
