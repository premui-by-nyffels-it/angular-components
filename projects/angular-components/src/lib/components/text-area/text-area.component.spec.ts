import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiTextArea } from './text-area.component';

describe('PremuiTextArea', () => {
  let component: PremuiTextArea;
  let fixture: ComponentFixture<PremuiTextArea>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiTextArea ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiTextArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
