
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges,  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { GastosService } from '../../services/Gastos/gastos.service';
import { GastoDto } from '../../models/Gasto/GastoDto';
import { GastoModel } from '../../models/Gasto/Gasto';

@Component({
  selector: 'app-card-gastos',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, CurrencyPipe],
  templateUrl: './card-gastos.component.html',
  styleUrl: './card-gastos.component.css'
})
export class CardGastosComponent implements OnInit, OnChanges {

  valor: number = 0

  gastosService = inject(GastosService)

  @Input({required: true}) gastoInput!: GastoModel



  ngOnInit(): void {
    console.log(this.gastoInput)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['gastoInput']){
      
    }
  }


}
