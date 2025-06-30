import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LogInModel, RegisterModel } from '../models/models';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorResponse } from '../models/ErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}Identity`;
  private accessTokenSubject = new BehaviorSubject<object | null>(null);
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

  Register(payload: { register: RegisterModel }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload,
      { responseType: 'text' });
  }

  signIn(payload: { Login: LogInModel }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, payload).pipe(
      tap(tokens => {
        
        this.setTokens(tokens);
        this.accessTokenSubject.next(tokens);
        this.getAccessToken();
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<any> {
    
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(tokens => {
         
        this.setTokens(tokens);
        this.accessTokenSubject.next(tokens);
      }),
      catchError(err => {
         
        console.error('Refresh token API error:', err); // Debug log
        this.logout();
        this.router.navigate(['/auth/login']);
        return throwError(() => err);
      })
    );
  }
  setTokens(token: any) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  logout() {
    localStorage.removeItem('token');
    this.accessTokenSubject.next(null);
  }

  getAccessToken(): string | null {
     
    try {
      const tokenItem = localStorage.getItem('token');
      if (!tokenItem) return null;

      const tokenObj = JSON.parse(tokenItem);
      return tokenObj?.token ?? null;
    } catch (error) {
      console.error('Invalid token in localStorage:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const tokenObj = JSON.parse(token);
      return tokenObj?.refreshToken || null;
    } catch (error) {
      console.error('Invalid token format', error);
      return null;
    }
  }
  getAccessTokenSubject(): BehaviorSubject<object | null> {
    return this.accessTokenSubject;
  }

  GetUserRoles(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserRoles?email=` + email);
  }

  getUserEmail(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenObj = JSON.parse(token);
      const decodedToken = this.jwtHelper.decodeToken(tokenObj.token);
      return decodedToken?.email;
    }
    return '';
  }

    getUserTokenRoles(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenObj = JSON.parse(token);
      const decodedToken = this.jwtHelper.decodeToken(tokenObj.token);
      return decodedToken?.role;
    }
  }
private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ErrorResponse = {
      type: 'UnknownError',
      message: 'An unexpected error occurred',
      status: error.status || 500,
      errors: null,
      timestamp: new Date().toISOString()
    };

    if (error.error && typeof error.error === 'object') {
      errorResponse = {
        type: error.error.type || 'UnknownError',
        message: error.error.message || 'An error occurred',
        status: error.error.statusCode || error.status,
        errors: error.error.errors || null,
        stackTrace: error.error.stackTrace || null,
        timestamp: error.error.timestamp || new Date().toISOString()
      };
    }

    return throwError(() => errorResponse);
  }
}
