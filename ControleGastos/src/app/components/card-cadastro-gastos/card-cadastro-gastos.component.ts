import { Component, EventEmitter, OnInit, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GastoDto } from '../../models/Gasto/GastoDto';
import { GastosService } from '../../services/Gastos/gastos.service';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';

@Component({
  selector: 'app-card-cadastro-gastos',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './card-cadastro-gastos.component.html',
  styleUrl: './card-cadastro-gastos.component.css'
})
export class CardCadastroGastosComponent implements OnInit {

  categoriaId = '';
  valor!: number

  gastosService = inject(GastosService)
  categorias: CategoriaModel[] = [];

  @Output() gastosOutput = new EventEmitter<GastoDto>()

  gastos: GastoDto = {} as GastoDto;  // ✅ Inicializa o objeto

  ngOnInit(): void {
    this.gastosService.getCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }


  salvar() {
    if (!this.categoriaId || !this.valor) {
      alert('Preencha todos os campos!');
      return;
    }

    this.gastosOutput.emit({
      categoriaId: this.categoriaId,
      valor: this.valor
    });

    this.categoriaId = '';
    this.valor = undefined!;
  }


}
