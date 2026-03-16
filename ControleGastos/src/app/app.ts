import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScreenBaseComponent } from './shared/screen-base/screen-base.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, ScreenBaseComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
