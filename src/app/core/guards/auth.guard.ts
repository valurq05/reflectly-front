import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifySession().then(() => {
    if (!authService.isLoggedIn()) {
      router.navigate(['']);
      return false;
    }
    return true;
  });

 
};
 