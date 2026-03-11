import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioRequestDto } from '../../models/Usuario/UsuarioRequestDto';
import { Observable } from 'rxjs';
import { UsuarioResponseDto } from '../../models/Usuario/UsuarioResponseDto';
import { HttpClient } from '@angular/common/http';

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
      // JWT tem 3 partes: header.payload.signature
      const payload = token.split('.')[1];
      // Decodifica de base64
      const decodedPayload = atob(payload);
      // Converte para objeto
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
    return decoded?.sub || decoded?.id || null;
  }

  getUserEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.email || null;
  }

  getUserName(): string | null {
    const decoded = this.decodeToken();
    return decoded?.name || decoded?.username || null;
  }

  logout() {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
    }
    this.isLoggedIn.set(false);
  }
}
