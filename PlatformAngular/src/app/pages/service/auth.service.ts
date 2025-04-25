import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LogInModel, RegisterModel } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44300/api/Identity';
  private accessTokenSubject = new BehaviorSubject<object | null>(null);
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router) { }

  Register(payload: { register: RegisterModel }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  signIn(payload: { Login: LogInModel }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, payload).pipe(
      tap(tokens => {
        debugger
        this.setTokens(tokens);
        this.accessTokenSubject.next(tokens);
        this.getAccessToken();
      }),
      catchError(err => throwError(() => err))
    );
  }

  refreshToken(): Observable<any> {
    debugger
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        debugger
        this.setTokens(tokens);
        this.accessTokenSubject.next(tokens);
      }),
      catchError(err => {
        debugger
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
    debugger
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
    debugger
    const tokenObj = JSON.parse(localStorage.getItem('token') || 'null');
    return tokenObj.refreshToken;
  }

  getAccessTokenSubject(): BehaviorSubject<object | null> {
    return this.accessTokenSubject;
  }
}
