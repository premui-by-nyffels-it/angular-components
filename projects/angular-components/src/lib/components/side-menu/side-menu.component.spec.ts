import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiSideMenu, PremuiSideMenuService } from './side-menu.component';

describe('PremuiSideMenu', () => {
  let component: PremuiSideMenu;
  let fixture: ComponentFixture<PremuiSideMenu>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremuiSideMenu ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiSideMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


describe('PremuiSideMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PremuiSideMenuService = TestBed.get(PremuiSideMenuService);
    expect(service).toBeTruthy();
  });
});
