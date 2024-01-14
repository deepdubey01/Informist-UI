import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';
import { ConfirmationDialogComponent } from '../mat-design/confirmation-dialog/confirmation-dialog.component';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-topic-manage',
  templateUrl: './subpackage-manage.component.html',
  styleUrls: ['./subpackage-manage.component.css']
})
export class SubpackageManageComponent {
  users: any[] = [];
  package_id: any = '';
  error_message: string = '';
  isSidebarOpen: any;
  constructor(
    private back: BackbuttonService,
    private adminAPI: AdminApiService,
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private adminAuth: AdminAuthService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.package_id = this.route.snapshot.queryParamMap.get('package_id') || '1';
    this.adminAPI.getsubPackage(this.package_id).subscribe(
      (response) => {
        if (response.code === 200) {
          this.users = response.data;
        } else if (response.code == 400) {
          this.error_message = response.message;
        }
      }
    );
  }


  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'badge bg-success' : 'badge bg-danger';
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }


  goBack() {
    this.back.navigateBack();
  }

  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }


  printStatus(sub_package_id: number, status: string): void {
    let newStatus: string;
    console.log(sub_package_id);
    if (status === 'ACTIVE') {
      newStatus = 'INACTIVE';
    } else {
      newStatus = 'ACTIVE';
    }

    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: 'sm', centered: true
    });
    modalRef.componentInstance.message = `Are you sure you want to change the status to ${newStatus}?`;
    modalRef.result.then((result) => {
      if (result === true) {
        const updateData = { sub_package_id: sub_package_id, status: newStatus };
        this.adminAPI.updatesubPackage(updateData).subscribe(
          (response) => {
            if (response.code === 200) {
              window.location.reload();
            }
          }
        );
      }
    });
  }

  adminlogout() {
    this.adminAuth.logout();
    this.router.navigate(['admin/admin-login']);
    console.log(this.adminAuth.getAdminToken());
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
