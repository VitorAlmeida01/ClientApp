import { Component, inject, OnInit } from '@angular/core';
import { CardPerfilComponent } from "../../components/card-perfil/card-perfil.component";
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-perfil-page',
  imports: [CardPerfilComponent],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit{


  auth = inject(AuthService);
  nomeUsuario = '';
  emailUsuario = '';

  ngOnInit(): void {
    this.nomeUsuario = this.auth.getUserName() ?? 'Usuario';
    this.emailUsuario = this.auth.getUserEmail() ?? 'email@nao-informado.com';
  }

}
