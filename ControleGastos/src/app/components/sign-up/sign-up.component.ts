import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/Usuarios/usuarios.service';

@Component({
  selector: 'app-sign-up',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  nome = ''
  email = '';
  senha = '';
  confirmacaoSenha = '';
  erroSenha = false;

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  cadastrar() {
    if (this.senha !== this.confirmacaoSenha) {
      this.erroSenha = true;
      return;
    }
    this.erroSenha = false;

    this.usuariosService.setUsuario({ nome: this.nome ,email: this.email, senha: this.senha }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Erro ao cadastrar:', err)
    });
  }


}
