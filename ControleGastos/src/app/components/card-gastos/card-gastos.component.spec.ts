import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGastosComponent } from './card-gastos.component';

describe('CardGastosComponent', () => {
  let component: CardGastosComponent;
  let fixture: ComponentFixture<CardGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
