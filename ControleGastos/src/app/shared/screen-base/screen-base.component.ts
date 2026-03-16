import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UsuarioNavbarInfo } from '../../services/Auth/auth.service';

interface MenuItemConfig {
  label: string;
  route: string;
  icon: string;
  description?: string;
  roles?: string[];
}

@Component({
  selector: 'app-screen-base',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive],
  templateUrl: './screen-base.component.html',
  styleUrl: './screen-base.component.css'
})
export class ScreenBaseComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly authService = inject(AuthService);
  readonly userInfo = signal<UsuarioNavbarInfo | null>(null);
  readonly menuConfig = signal<MenuItemConfig[]>([]);
  readonly menuItems = computed(() => {
    if (!this.authService.isLoggedIn()) {
      return [];
    }

    const roles = this.userInfo()?.roles ?? this.authService.getUserRoles();

    return this.menuConfig().filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      return item.roles.some((role) => roles.includes(role));
    });
  });

  constructor() {
    this.loadMenuConfig();

    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.userInfo.set(null);
        return;
      }

      this.loadUserInfo();
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private loadMenuConfig(): void {
    this.http.get<MenuItemConfig[]>('/menu-config.json').subscribe({
      next: (items) => this.menuConfig.set(items),
      error: (error) => console.error('Erro ao carregar configuracao do menu:', error)
    });
  }

  private loadUserInfo(): void {
    this.authService.getUsuarioNavbarInfo().subscribe({
      next: (info) => this.userInfo.set({
        nome: info.nome,
        email: info.email,
        roles: info.roles ?? []
      }),
      error: () => {
        this.userInfo.set({
          nome: this.authService.getUserName() ?? '',
          email: this.authService.getUserEmail() ?? '',
          roles: this.authService.getUserRoles()
        });
      }
    });
  }

}
