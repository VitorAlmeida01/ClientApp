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

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  authService = inject(AuthService);
  router = inject(Router);




  onLogin() {
    console.log('Antes do login:', this.authService.isLoggedIn());
    this.authService.login();
    console.log('Depois do login:', this.authService.isLoggedIn());

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/gastos']);
    }
  }
}
