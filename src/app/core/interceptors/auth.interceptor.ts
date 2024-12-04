import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ApiResponse } from '../model/common.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

 if (req.url.includes('/refresh')) {
  const refreshReq = req.clone({
    withCredentials: true,
  });
  return next(refreshReq);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err) => {
      return authService.getRefreshToken().pipe(
        switchMap((response) => {
          authService.setAccessToken(response.NewAccessToken);
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.NewAccessToken}`
            }
          });
          return next(newReq);
        }),
        catchError((refreshErr) => {
          const finalError = new Error(refreshErr);
          console.log("error de refresh");
          authService.setAccessToken('');
          return throwError(() => finalError);
        })
      )
    })
  );
};
