import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';

@Component({
  selector: 'app-card-categorias',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './card-categorias.component.html',
  styleUrl: './card-categorias.component.css'
})
export class CardCategoriasComponent implements OnChanges {

  @Input({ required: true }) categoriaInput!: CategoriaModel


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriaInput']) {
      console.log(this.categoriaInput)
    }
  }
}
