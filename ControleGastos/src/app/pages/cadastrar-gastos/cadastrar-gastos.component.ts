import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardCadastroGastosComponent } from "../../components/card-cadastro-gastos/card-cadastro-gastos.component";
import { ScreenBaseComponent } from "../../shared/screen-base/screen-base.component";
import { GastoModel } from '../../models/Gasto/Gasto';
import { GastosService } from '../../services/Gastos/gastos.service';
import { CardGastosComponent } from "../../components/card-gastos/card-gastos.component";
import { GastoDto } from '../../models/Gasto/GastoDto';

@Component({
  selector: 'app-cadastrar-gastos',
  imports: [CardCadastroGastosComponent, ScreenBaseComponent, CardGastosComponent],
  templateUrl: './cadastrar-gastos.component.html',
  styleUrl: './cadastrar-gastos.component.css'
})
export class CadastrarGastosComponent implements OnInit {
// Objeto que sera enviado ao back-end no POST
  gasto: GastoDto = {} as GastoDto;
// Injeção de dependência da service
  gastosService = inject(GastosService)
  // Array do tipo GastoModel que receberá do back-end no GET
  gastos: GastoModel[] = []

  ngOnInit(): void {
    this.gastosService.getGastos().subscribe(data => {
      this.gastos = data;
      console.log(this.gastos)
    });
  }
  


  receberDados(gasto: GastoDto): void {
    // ✅ 1. Salva no backend PRIMEIRO
    this.gastosService.setGastos(gasto).subscribe({
      next: (novoGasto) => {
        // ✅ 2. Adiciona com ID real do banco
        // this.gastos.push(novoGasto);
        // Recarrega a lista completa do backend
        this.gastosService.getGastos().subscribe(data => {
          this.gastos = data
        })
      },
      error: (erro) => {
        console.error('Erro ao salvar gasto:', erro);
        
        if (erro.status === 403) {
          alert('❌ Erro 403: Sua sessão expirou ou você não tem permissão. Faça login novamente.');
        } else if (erro.status === 401) {
          alert('❌ Erro 401: Não autenticado. Faça login novamente.');
        } else {
          alert(`❌ Erro ao cadastrar gasto (${erro.status}). Tente novamente.`);
        }
      }
    });
  }

}
