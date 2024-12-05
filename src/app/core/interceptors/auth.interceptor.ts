import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { LocalStorage } from '../constants.ts/constants';

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
  const token = authService.getUserToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err) => {
      return authService.getRefreshToken().pipe(
        switchMap((response) => {
          console.log(err);
          localStorage.setItem(LocalStorage.token, response.NewAccessToken);
          console.log("refresh interceptor");
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
          localStorage.removeItem('Token');
          // authService.setAccessToken('');
          return throwError(() => finalError);
        })
      )
    })
  );

};
