import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-perfil',
  imports: [],
  templateUrl: './card-perfil.component.html',
  styleUrl: './card-perfil.component.css'
})
export class CardPerfilComponent {

  @Input() nome!: string
  @Input() email!: string

}
