import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';
import { GastosService } from '../../services/Gastos/gastos.service';
import { GastoModel } from '../../models/Gasto/Gasto';
import { UsuarioRequestDto } from '../../models/Usuario/UsuarioRequestDto';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  authService = inject(AuthService);
  router = inject(Router);

  email: string = ''
  senha: string = ''
  mensagemErro = '';



  onLogin() {
    this.mensagemErro = '';

    console.log('Antes do login:', this.authService.isLoggedIn());
    
    const usuario: UsuarioRequestDto = {
      email: this.email,
      senha: this.senha
    };
    
    this.authService.onLogin(usuario).subscribe({
      next: (response) => {
        // Salva o token recebido da API
        if (response.token) {
          this.authService.saveToken(response.token);
        }

        this.mensagemErro = '';
        console.log('Depois do login:', this.authService.isLoggedIn());
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/gastos']);
        }
      },
      error: (error) => {
        console.error('Erro no login:', error);

        if (error?.status === 401 || error?.status === 403) {
          this.mensagemErro = 'Login ou senha invalidos.';
          return;
        }

        this.mensagemErro = 'Nao foi possivel realizar o login. Tente novamente.';
      }
    });
  }
}
