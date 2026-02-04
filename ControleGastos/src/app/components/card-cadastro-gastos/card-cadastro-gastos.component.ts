import { Component, EventEmitter, inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GastoDto } from '../../models/Gasto/GastoDto';
import { GastosService } from '../../services/Gastos/gastos.service';

@Component({
  selector: 'app-card-cadastro-gastos',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './card-cadastro-gastos.component.html',
  styleUrl: './card-cadastro-gastos.component.css'
})
export class CardCadastroGastosComponent {

  tipo!: string
  valor!: number

  // gastosService = inject(GastosService)

  @Output() gastosOutput = new EventEmitter<GastoDto>()

  gastos: GastoDto = {} as GastoDto;  // ✅ Inicializa o objeto


  salvar() {
    if (!this.tipo || !this.valor) {
      alert('Preencha todos os campos!');
      return;
    }


    this.gastosOutput.emit({
      tipo: this.tipo,
      valor: this.valor
    })

    this.tipo = ''
    this.valor = undefined!
  }


}
