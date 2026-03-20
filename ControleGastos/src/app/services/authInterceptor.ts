import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth/auth.service';
import { environment } from '../../environments/environment';
import '../models/runtime-config.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.Token;
  const runtimeApiBaseUrl =
    typeof window !== 'undefined' ? window.__RUNTIME_CONFIG__?.apiBaseUrl ?? '' : '';
  const apiBaseUrl = (runtimeApiBaseUrl || environment.apiBaseUrl || '').replace(/\/$/, '');

  // Converte /api/... para <apiBaseUrl>/api/... quando apiBaseUrl estiver definido.
  const reqWithApiBase =
    req.url.startsWith('/api') && apiBaseUrl
      ? req.clone({ url: `${apiBaseUrl}${req.url}` })
      : req;

  // Não adiciona token na rota de login
  if (
    reqWithApiBase.url.includes('/auth/login') ||
    reqWithApiBase.url.includes('/auth/signup')
  ) {
    console.log('🔓 Requisição sem token:', reqWithApiBase.url);
    return next(reqWithApiBase);
  }

  if (token) {
    console.log('🔒 Token encontrado, adicionando ao header');
    console.log('📍 URL da requisição:', reqWithApiBase.url);
    console.log('🎫 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
    
    const clonedRequest = reqWithApiBase.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.warn('⚠️ Token não encontrado! Requisição sem autenticação para:', reqWithApiBase.url);
  return next(reqWithApiBase);
};