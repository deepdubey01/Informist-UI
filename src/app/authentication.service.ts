import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://172.17.81.34:8080/api';
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private redirectUrlKey = 'redirectUrl';
  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.code === 200) {

          this.setToken(response.data.access_token);
          this.setUserId(response.data.user_id);
          localStorage.removeItem("requestNews");
          localStorage.removeItem('MainPermissionwires');
          window.location.href = 'index';
          if (response.error == 1) {
            this.logout();
          }
        }
      }),
      catchError(error => {

        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  private setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  saveAuthData(username: string, password: string) {
    const authData = { username, password };
    localStorage.setItem(this.tokenKey, JSON.stringify(authData));
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get<any>(`${this.apiUrl}`, { headers });
    }
    return of(null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.clearToken();
    localStorage.removeItem("requestNews");
    localStorage.removeItem('MainPermissionwires');
  }

  saveRedirectUrl(redirectUrl: string): void {
    localStorage.setItem(this.redirectUrlKey, redirectUrl);
  }

  getRedirectUrl(): string | null {
    const url = localStorage.getItem(this.redirectUrlKey);
    localStorage.removeItem(this.redirectUrlKey);

    return url;
  }
}
