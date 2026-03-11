import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.Token;

  // Não adiciona token na rota de login
  if (req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
    console.log('🔓 Requisição sem token:', req.url);
    return next(req);
  }

  if (token) {
    console.log('🔒 Token encontrado, adicionando ao header');
    console.log('📍 URL da requisição:', req.url);
    console.log('🎫 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
    
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.warn('⚠️ Token não encontrado! Requisição sem autenticação para:', req.url);
  return next(req);
};