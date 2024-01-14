import { Injectable } from '@angular/core';
import { ProductService } from '../api.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import the Router module

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private adminTokenKey = 'adminToken';
  private adminRole = 'adminRole';
  private adminRedirectUrlKey = 'adminRedirectUrl';

  constructor(private productService: ProductService, private router: Router) { }

  adminLogin(credentials: any): Observable<any> {
    return this.productService.adminlogIn(credentials).pipe(
      catchError((error) => {
        if (error.status === 500) {
          this.redirectToLogin();
        }
        return throwError(error);
      })
    );
  }

  setAdminToken(token: string): void {
    localStorage.setItem(this.adminTokenKey, token);
    console.log('Admin token set:', token);
  }

  setAdminRole(role: string): void {
    localStorage.setItem(this.adminRole, role);
  }

  getAdminToken(): string | null {
    const token = localStorage.getItem(this.adminTokenKey);
    return token;
  }

  getAdminRole(): string | null {
    const role = localStorage.getItem(this.adminRole);
    return role;
  }

  clearAdminToken(): void {
    localStorage.removeItem(this.adminTokenKey);
  }

  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }

  logout(): void {
    this.clearAdminToken();
  }

  saveAdminRedirectUrl(url: string): void {
    localStorage.setItem(this.adminRedirectUrlKey, url);
  }

  getAdminRedirectUrl(): string | null {
    const url = localStorage.getItem(this.adminRedirectUrlKey);
    localStorage.removeItem(this.adminRedirectUrlKey);
    return url;
  }

  private redirectToLogin(): void {
    this.router.navigate(['admin/admin-login']);
  }
}
