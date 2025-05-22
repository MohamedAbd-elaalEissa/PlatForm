import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// What refreshTokenSubject Does
// It acts as a signal to:
// Queue and wait for the new token to be available.

// Ensure only one refresh token request happens at a time.

// Resume all pending requests after the new token is retrieved.


export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const accessToken: string | null = auth.getAccessToken(); // Now returns string
  const router = inject(Router);
  const authReq = accessToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error: Error) => {
      console.log('Interceptor caught error:', error.message); // Debug log
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log('Handling 401 error'); // Debug log
        debugger
        if (authReq.url.includes('Login')) {
          return throwError(() => error); 
        }
        return handle401Error(authReq, next, auth, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: AuthService,
  router: Router
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return auth.refreshToken().pipe(
      switchMap((newAccessToken: any) => {
        debugger
        isRefreshing = false;
        refreshTokenSubject.next(newAccessToken.token);
        const newReq = request.clone({
          setHeaders: { Authorization: `Bearer ${newAccessToken.token}` }
        });
        return next(newReq);
      }),
      catchError((err) => {
        debugger
        refreshTokenSubject.next('REFRESH_FAILED');

        isRefreshing = false;
        auth.logout();
        if (!request.url.includes('/auth/login')) {
          router.navigate(['/auth/login']);
        }
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== undefined), // Allow null to pass through
      take(1),
      switchMap((token) => {
        debugger;

        if (token === null || token === 'REFRESH_FAILED') {
          // Handle both null and explicit failure cases
          auth.logout();
          router.navigate(['/auth/login']);
          return throwError(() => new Error('Refresh token failed'));
        }

        // Only proceed if we have a valid token
        const newReq = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(newReq);
      })
    );
  }
}
