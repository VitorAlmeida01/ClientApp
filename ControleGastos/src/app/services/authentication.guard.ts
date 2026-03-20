import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './Auth/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLogged = !!authService.Token;

  if (isLogged) {
    return true;
  }

  // Redirect using UrlTree to avoid side effects inside guard.
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.Token) {
    return router.createUrlTree(['/login']);
  }

  const rolesNormalizadas = authService
    .getUserRoles()
    .map((role) => role.toUpperCase());

  const isAdmin = rolesNormalizadas.includes('ROLE_ADMIN') || rolesNormalizadas.includes('ADMIN');

  if (isAdmin) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
