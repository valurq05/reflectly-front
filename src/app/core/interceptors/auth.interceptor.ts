import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

   if (req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/chatbot') || req.url.includes('/detectar-emocion')) {
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
          console.log(token);
          console.log("refresh interceptor");
  
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.NewAccessToken}`
            }
          });
  
          return next(newReq);
        }),
        catchError((refreshErr) => {
          console.error("Error al refrescar el token:", refreshErr);
  
          // Obtener más detalles del error
          const errorMessage = refreshErr?.message || JSON.stringify(refreshErr);
          const errorStatus = refreshErr?.status || 'Desconocido';
          const errorResponse = refreshErr?.error ? JSON.stringify(refreshErr.error) : 'Sin respuesta';
  
          console.log(`Detalles del error: Status: ${errorStatus}, Mensaje: ${errorMessage}, Respuesta: ${errorResponse}`);
  
          authService.setAccessToken('');
          return throwError(() => new Error(`Error de refresh: ${errorMessage}, Status: ${errorStatus}, Respuesta: ${errorResponse}`));
        })
      );
    })
  );
  

};
