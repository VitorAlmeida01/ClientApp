import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCadastroGastosComponent } from './card-cadastro-gastos.component';

describe('CardCadastroGastosComponent', () => {
  let component: CardCadastroGastosComponent;
  let fixture: ComponentFixture<CardCadastroGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCadastroGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCadastroGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
