import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const rol = localStorage.getItem('ROL');

    if (rol === '1') {
      router.navigate(['adminhome']);
    } else if (rol === '2') {
      router.navigate(['home']);
    }
  }

  return true;
};

