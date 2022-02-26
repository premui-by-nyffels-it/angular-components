import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremuiCard } from './card.component';

describe('PremuiCard', () => {
  let component: PremuiCard;
  let fixture: ComponentFixture<PremuiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremuiCard ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremuiCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
