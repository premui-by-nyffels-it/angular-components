import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PremuiSpacer } from './spacer.component';

describe('PremuiSpacer', () => {
  let component: PremuiSpacer;
  let fixture: ComponentFixture<PremuiSpacer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiSpacer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSpacer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
