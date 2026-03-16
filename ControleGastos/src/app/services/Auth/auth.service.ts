import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioRequestDto } from '../../models/Usuario/UsuarioRequestDto';
import { Observable } from 'rxjs';
import { UsuarioResponseDto } from '../../models/Usuario/UsuarioResponseDto';
import { HttpClient } from '@angular/common/http';

export interface UsuarioNavbarInfo {
  roles: string[];
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal(false);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  private apiUrl = '/api/auth/login';


  constructor(){
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      const tokenJWT = sessionStorage.getItem('token');
      if (tokenJWT) {
        this.isLoggedIn.set(true);
      }
    }
  }

  onLogin(usuario: UsuarioRequestDto): Observable<UsuarioResponseDto> {
    return this.http.post<UsuarioResponseDto>(`${this.apiUrl}`, usuario);
  }

  getUsuarioNavbarInfo(): Observable<UsuarioNavbarInfo> {
    return this.http.get<UsuarioNavbarInfo>('/api/auth/me');
  }

  saveToken(token: string) {
    if (this.isBrowser) {
      sessionStorage.setItem('token', token);
      this.isLoggedIn.set(true);
    }
  }

  get Token(){
    if (this.isBrowser) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  // Decodifica o token JWT e retorna o payload
  decodeToken(): any {
    const token = this.Token;
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = decodeURIComponent(
        atob(normalizedPayload)
          .split('')
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Obtém informações específicas do token
  getUserInfo(): any {
    const decoded = this.decodeToken();
    return decoded;
  }

  // Exemplo de métodos para campos específicos
  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.id || decoded?.id || null;
  }

  getUserEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.email || null;
  }

  getUserName(): string | null {
    const decoded = this.decodeToken();
    return decoded?.nome || decoded?.username || null;
  }

  getUserRoles(): string[] {
    const decoded = this.decodeToken();
    const roles = decoded?.roles || decoded?.authorities || decoded?.role;

    if (Array.isArray(roles)) {
      return roles;
    }

    if (typeof roles === 'string' && roles.length > 0) {
      return [roles];
    }

    return [];
  }

  logout() {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
    }
    this.isLoggedIn.set(false);
  }
}
