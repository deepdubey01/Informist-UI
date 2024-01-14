import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AdminAuthService } from './service/admin-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertDialogComponent } from './modules/admin-lte/mat-design/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private modalService: NgbModal) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.adminAuthService.getAdminRole(); // Get the user's role

    if (this.adminAuthService.isAdminLoggedIn()) {
      console.log(this.adminAuthService.getAdminToken());

      if (userRole === 'ADMIN') {
        if (state.url.includes('admin/payment-list') || state.url.includes('admin/abc')) {
          this.openAlertDialog('Access Denied', 'You do not have access to this page.');
          return false;
        }
        return true;
      } else if (userRole === 'ACCOUNTS') {
        if (state.url.includes('admin/payment-list')) {
          return true;
        } else {
          this.router.navigate(['/admin/payment-list']);
          return false;
        }
      } else if (userRole === 'SUPER_ADMIN') {
        return true;
      }
    }

    this.adminAuthService.saveAdminRedirectUrl(state.url);
    this.router.navigate(['/admin/admin-login']);
    return false;
  }

  private openAlertDialog(title: string, message: string): void {
    const modalRef = this.modalService.open(AlertDialogComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.result.then((result) => {
      this.router.navigate(['/admin/user-manage']);
    });
  }
}
