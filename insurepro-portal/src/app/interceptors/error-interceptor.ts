import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          if (req.url.includes('/auth/refresh')) {
            authService.logOut();
            router.navigate(['/login']);
            return throwError(() => error);
          }

          // If refresh already running
          if (authService.isRefreshing) {
            return authService.refreshTokenSubject.pipe(
              filter((token) => token !== null),

              take(1),

              switchMap((token) => {
                const retryRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                return next(retryRequest);
              }),
            );
          }

          // First request that detected 401
          authService.isRefreshing = true;

          authService.refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response) => {
              authService.isRefreshing = false;

              authService.refreshTokenSubject.next(response.accessToken);

              const retryRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });

              return next(retryRequest);
            }),

            catchError((refreshError) => {
              authService.isRefreshing = false;

              authService.refreshTokenSubject.next(null);

              authService.logOut();

              router.navigate(['/login']);

              return throwError(() => refreshError);
            }),
          );

          break;

        case 403:
          alert('Access Denied');
          break;

        case 404:
          alert('Resource Not Found');
          break;

        case 500:
          alert('Server Unreachable');
          break;
      }

      return throwError(() => error);
    }),
  );
};
