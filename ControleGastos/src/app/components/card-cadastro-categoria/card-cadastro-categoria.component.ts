import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaRequestDto } from '../../models/Categoria/CategoriaRequestDto';

@Component({
  selector: 'app-card-cadastro-categoria',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './card-cadastro-categoria.component.html',
  styleUrl: './card-cadastro-categoria.component.css'
})
export class CardCadastroCategoriaComponent {

  categoria = ''

  @Output() categoriaOutput = new EventEmitter<CategoriaRequestDto>()

  salvar() {
    if (!this.categoria) {
      alert('Preencha todos os campos!');
      return;
    }

    this.categoriaOutput.emit({
      tipo: this.categoria
    });

    this.categoria = '';
  }
}
