import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        Router,
      ],
    });

    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    const guard = new authGuard(authService, router);
    expect(guard).toBeTruthy();
  });

  it('should allow navigation when user is logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);

    const guard = new authGuard(authService, router);
    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const stateSnapshot = {} as RouterStateSnapshot;

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(canActivate).toBe(true);
  });

  it('should save redirect URL and navigate to login when user is not logged in', () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);

    const guard = new authGuard(authService, router);
    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const stateSnapshot = { url: '/some-protected-route' } as RouterStateSnapshot;

    spyOn(authService, 'saveRedirectUrl');
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(canActivate).toBe(false);
    expect(authService.saveRedirectUrl).toHaveBeenCalledWith('/some-protected-route');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
