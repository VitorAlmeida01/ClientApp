import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CategoriasService } from '../../services/Categorias/categorias.service';
import { CategoriaRequestDto } from '../../models/Categoria/CategoriaRequestDto';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-categorias-page',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, DatePipe],
  templateUrl: './categorias-page.component.html',
  styleUrl: './categorias-page.component.css'
})
export class CategoriasPageComponent implements OnInit{

  constructor(
    private categoriasService: CategoriasService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  categorias: CategoriaModel[] = [];
  modalAberto = false;
  modalModo: 'cadastro' | 'edicao' = 'cadastro';
  categoriaEmEdicaoId: string | null = null;
  novaCategoria = '';

  ngOnInit(): void {
    this.carregarCategorias();
  }

  abrirModal(): void {
    this.modalModo = 'cadastro';
    this.categoriaEmEdicaoId = null;
    this.novaCategoria = '';
    this.modalAberto = true;
  }

  abrirModalEdicao(categoria: CategoriaModel): void {
    this.modalModo = 'edicao';
    this.categoriaEmEdicaoId = categoria.id;
    this.novaCategoria = categoria.tipo;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalModo = 'cadastro';
    this.categoriaEmEdicaoId = null;
    this.novaCategoria = '';
  }

  private carregarCategorias(): void {
    this.categoriasService.getCategorias().subscribe((dados) => {
      this.categorias = dados;
    });
  }

  receberDados(categoria: CategoriaRequestDto): void {
    this.categoriasService.setCategorias(categoria).subscribe({
      next: (novaCategoria) => {
        console.log('Nova categoria: ', novaCategoria);
        this.carregarCategorias();
        this.fecharModal();
      }
    });
  }

  cadastrarCategoria(): void {
    const tipo = this.novaCategoria.trim();

    if (!tipo) {
      alert('Preencha o nome da categoria!');
      return;
    }

    if (this.modalModo === 'edicao') {
      this.atualizarCategoria(tipo);
      return;
    }

    this.receberDados({ tipo });
  }

  private atualizarCategoria(tipo: string): void {
    if (!this.categoriaEmEdicaoId) return;

    this.categoriasService.updateCategoria(this.categoriaEmEdicaoId, { tipo }).subscribe({
      next: () => {
        this.carregarCategorias();
        this.fecharModal();
      },
      error: (erro) => {
        console.error('Erro ao editar categoria:', erro);
        alert('Erro ao editar categoria. Tente novamente.');
      }
    });
  }

  excluir(id: string): void {
    this.confirmationDialogService
      .confirm({
        title: 'Excluir categoria',
        message: 'Voce tem certeza?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      })
      .subscribe((confirmado) => {
        if (!confirmado) return;

        this.categoriasService.deleteCategoria(id).subscribe({
          next: () => this.carregarCategorias(),
          error: (erro) => {
            console.error('Erro ao excluir categoria:', erro);
            alert('Erro ao excluir categoria. Tente novamente.');
          }
        });
      });
  }
}
