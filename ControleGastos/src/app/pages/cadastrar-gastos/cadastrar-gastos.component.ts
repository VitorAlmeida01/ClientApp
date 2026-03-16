import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GastoModel } from '../../models/Gasto/Gasto';
import { GastosService } from '../../services/Gastos/gastos.service';
import { GastoDto } from '../../models/Gasto/GastoDto';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from '../../services/Auth/auth.service';

type PeriodoFiltro = 'todos' | 'dia' | 'semana' | 'mes' | 'seis-meses' | 'ano';

@Component({
  selector: 'app-cadastrar-gastos',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './cadastrar-gastos.component.html',
  styleUrl: './cadastrar-gastos.component.css'
})
export class CadastrarGastosComponent implements OnInit {
  gasto: GastoDto = {} as GastoDto;
  gastosService = inject(GastosService);
  confirmationDialogService = inject(ConfirmationDialogService);
  authService = inject(AuthService);

  gastos: GastoModel[] = [];
  gastosFiltrados: GastoModel[] = [];
  categorias: CategoriaModel[] = [];

  modalAberto = false;
  modalModo: 'cadastro' | 'edicao' = 'cadastro';
  gastoEmEdicaoId: string | null = null;
  categoriaIdNovoGasto = '';
  valorNovoGasto: number | null = null;

  filtroCategoria = 'todos';
  filtroPeriodo: PeriodoFiltro = 'todos';

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarGastos();
  }

  abrirModal(): void {
    this.modalModo = 'cadastro';
    this.gastoEmEdicaoId = null;
    this.categoriaIdNovoGasto = '';
    this.valorNovoGasto = null;
    this.modalAberto = true;
  }

  abrirModalEdicao(gasto: GastoModel): void {
    const categoriaSelecionada = this.categorias.find((categoria) => categoria.tipo === gasto.tipo);

    if (!categoriaSelecionada) {
      alert('Nao foi possivel localizar a categoria deste gasto para editar.');
      return;
    }

    this.modalModo = 'edicao';
    this.gastoEmEdicaoId = gasto.id;
    this.categoriaIdNovoGasto = categoriaSelecionada.id;
    this.valorNovoGasto = gasto.valor;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalModo = 'cadastro';
    this.gastoEmEdicaoId = null;
    this.categoriaIdNovoGasto = '';
    this.valorNovoGasto = null;
  }

  onCategoriaFiltroChange(): void {
    this.carregarGastos();
  }

  onPeriodoFiltroChange(): void {
    this.aplicarFiltroPeriodo();
  }

  cadastrarGasto(): void {
    if (!this.categoriaIdNovoGasto || this.valorNovoGasto === null || this.valorNovoGasto <= 0) {
      alert('Preencha categoria e valor valido.');
      return;
    }

    if (this.modalModo === 'edicao') {
      this.atualizarGasto();
      return;
    }

    this.receberDados({
      categoriaId: this.categoriaIdNovoGasto,
      valor: this.valorNovoGasto
    });
  }

  private carregarCategorias(): void {
    this.gastosService.getCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  private carregarGastos(): void {
    const idUsuario = this.authService.getUserId() ?? '';
    const request$ =
      this.filtroCategoria === 'todos'
        ? this.gastosService.getGastos()
        : this.gastosService.getGastosPorTipo(this.filtroCategoria);

    request$.subscribe((data) => {
      this.gastos = data;
      this.aplicarFiltroPeriodo();
    });
  }

  private aplicarFiltroPeriodo(): void {
    this.gastosFiltrados = this.gastos.filter((gasto) => this.estaNoPeriodo(gasto.dtCriacao));
  }

  private estaNoPeriodo(dataIso: string): boolean {
    if (this.filtroPeriodo === 'todos') {
      return true;
    }

    const dataGasto = new Date(dataIso);
    if (Number.isNaN(dataGasto.getTime())) {
      return false;
    }

    const agora = new Date();

    if (this.filtroPeriodo === 'dia') {
      return (
        dataGasto.getFullYear() === agora.getFullYear() &&
        dataGasto.getMonth() === agora.getMonth() &&
        dataGasto.getDate() === agora.getDate()
      );
    }

    const limite = new Date(agora);

    if (this.filtroPeriodo === 'semana') {
      limite.setDate(agora.getDate() - 7);
      return dataGasto >= limite;
    }

    if (this.filtroPeriodo === 'mes') {
      limite.setMonth(agora.getMonth() - 1);
      return dataGasto >= limite;
    }

    if (this.filtroPeriodo === 'seis-meses') {
      limite.setMonth(agora.getMonth() - 6);
      return dataGasto >= limite;
    }

    limite.setFullYear(agora.getFullYear() - 1);
    return dataGasto >= limite;
  }

  receberDados(gasto: GastoDto): void {
    this.gastosService.setGastos(gasto).subscribe({
      next: () => {
        this.carregarGastos();
        this.fecharModal();
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

  private atualizarGasto(): void {
    if (!this.gastoEmEdicaoId || this.valorNovoGasto === null) {
      return;
    }

    this.gastosService
      .updateGasto(this.gastoEmEdicaoId, {
        categoriaId: this.categoriaIdNovoGasto,
        valor: this.valorNovoGasto
      })
      .subscribe({
        next: () => {
          this.carregarGastos();
          this.fecharModal();
        },
        error: (erro) => {
          console.error('Erro ao editar gasto:', erro);
          alert('Erro ao editar gasto. Tente novamente.');
        }
      });
  }

  excluir(id: string): void {
    this.confirmationDialogService
      .confirm({
        title: 'Excluir gasto',
        message: 'Voce tem certeza?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      })
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }

        this.gastosService.deleteGasto(id).subscribe({
          next: () => this.carregarGastos(),
          error: (erro) => {
            console.error('Erro ao excluir gasto:', erro);
            alert('Erro ao excluir gasto. Tente novamente.');
          }
        });
      });
  }
}
