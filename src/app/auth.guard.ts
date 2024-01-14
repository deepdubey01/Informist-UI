import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isUserLoggedIn()) {
      console.log(this.authService.getToken());
      return true;
    } else {
      this.router.navigate(['/login']);
    }

    this.authService.saveRedirectUrl(state.url);
    this.router.navigate(['/login']);
    return false;
  }
}
