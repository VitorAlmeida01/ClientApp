import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCadastroCategoriaComponent } from './card-cadastro-categoria.component';

describe('CardCadastroCategoriaComponent', () => {
  let component: CardCadastroCategoriaComponent;
  let fixture: ComponentFixture<CardCadastroCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCadastroCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCadastroCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
