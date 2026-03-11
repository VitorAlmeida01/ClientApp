import { Component, inject, OnInit } from '@angular/core';
import { ScreenBaseComponent } from "../../shared/screen-base/screen-base.component";
import { CardPerfilComponent } from "../../components/card-perfil/card-perfil.component";
import { GastosService } from '../../services/Gastos/gastos.service';
import { UsuarioResponseDto } from '../../models/Usuario/UsuarioResponseDto';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-perfil-page',
  imports: [ScreenBaseComponent, CardPerfilComponent],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit{


  auth = inject(AuthService)
  usuarioAtual!: UsuarioResponseDto

    ngOnInit(): void {
    console.log(this.auth.decodeToken())
    console.log(this.auth.getUserEmail())
  }

}
