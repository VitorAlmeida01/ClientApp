import { Component } from '@angular/core';
import { ScreenBaseComponent } from "../../shared/screen-base/screen-base.component";
import { CardPerfilComponent } from "../../components/card-perfil/card-perfil.component";

@Component({
  selector: 'app-perfil-page',
  imports: [ScreenBaseComponent, CardPerfilComponent],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent {

}
