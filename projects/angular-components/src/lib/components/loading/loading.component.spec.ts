import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremuiLoading } from './loading.component';

describe('PremuiLoading', () => {
  let component: PremuiLoading;
  let fixture: ComponentFixture<PremuiLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiLoading ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
