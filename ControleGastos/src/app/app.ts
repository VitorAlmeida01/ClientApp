import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/Auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);

  
}
