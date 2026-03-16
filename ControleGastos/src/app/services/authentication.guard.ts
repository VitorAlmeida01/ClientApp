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
