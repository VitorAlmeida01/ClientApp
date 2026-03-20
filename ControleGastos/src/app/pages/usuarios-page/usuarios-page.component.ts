import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsuariosService } from '../../services/Usuarios/usuarios.service';
import { UsuarioModel } from '../../models/Usuario/UsuarioModel';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-usuarios-page',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './usuarios-page.component.html',
  styleUrl: './usuarios-page.component.css'
})
export class UsuariosPageComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  carregando = true;
  erroCarregamento = '';
  modalAberto = false;
  usuarioEmEdicaoId: string | null = null;
  nomeUsuarioEdicao = '';
  emailUsuarioEdicao = '';

  constructor(
    private usuariosService: UsuariosService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  private carregarUsuarios(): void {
    this.carregando = true;
    this.erroCarregamento = '';

    this.usuariosService.getUsuarios().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar usuarios:', erro);
        this.erroCarregamento = 'Nao foi possivel carregar os usuarios.';
        this.carregando = false;
      }
    });
  }

  recarregar(): void {
    this.carregarUsuarios();
  }

  abrirModalEdicao(usuario: UsuarioModel): void {
    this.usuarioEmEdicaoId = usuario.id;
    this.nomeUsuarioEdicao = usuario.nome;
    this.emailUsuarioEdicao = usuario.email;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.usuarioEmEdicaoId = null;
    this.nomeUsuarioEdicao = '';
    this.emailUsuarioEdicao = '';
  }

  salvarEdicao(): void {
    if (!this.usuarioEmEdicaoId) {
      return;
    }

    const nome = this.nomeUsuarioEdicao.trim();
    const email = this.emailUsuarioEdicao.trim();

    if (!nome || !email) {
      alert('Preencha nome e email para editar o usuario.');
      return;
    }

    this.usuariosService.updateUsuario(this.usuarioEmEdicaoId, { nome, email }).subscribe({
      next: () => {
        this.carregarUsuarios();
        this.fecharModal();
      },
      error: (erro) => {
        console.error('Erro ao editar usuario:', erro);
        alert('Erro ao editar usuario. Tente novamente.');
      }
    });
  }

  excluir(id: string): void {
    this.confirmationDialogService
      .confirm({
        title: 'Excluir usuario',
        message: 'Voce tem certeza?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      })
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }

        this.usuariosService.deleteUsuario(id).subscribe({
          next: () => this.carregarUsuarios(),
          error: (erro) => {
            console.error('Erro ao excluir usuario:', erro);
            alert('Erro ao excluir usuario. Tente novamente.');
          }
        });
      });
  }
}
