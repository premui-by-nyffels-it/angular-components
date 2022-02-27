import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiTitleBar, PremuiTitleBarService } from './title-bar.component';

describe('PremuiTitleBar', () => {
  let component: PremuiTitleBar;
  let fixture: ComponentFixture<PremuiTitleBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiTitleBar ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiTitleBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('PremuiTitleBarService', () => {
  let service: PremuiTitleBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremuiTitleBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
