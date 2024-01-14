import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, NgZone } from '@angular/core';
import { SidebarLayoutComponent } from '../sidebar-layout/sidebar-layout.component';
import { Router } from '@angular/router';
import { BackbuttonService } from 'src/app/service/backbutton.service';
import { AdminApiService } from 'src/app/service/admin-api.service';
declare var $: any;
import * as XLSX from 'xlsx';
import { AdminAuthService } from 'src/app/service/admin-auth.service';

@Component({
  selector: 'app-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.css']
})
export class UsersManageComponent implements OnInit {
  user_id: any;
  users: any[] = [];
  isSidebarOpen: any;
  constructor(
    private productService: AdminApiService,
    private router: Router, private renderer: Renderer2,
    private back: BackbuttonService, private zone: NgZone,
    private adminAuth: AdminAuthService,
    private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const table = $('#dataTable').DataTable({
      });

      table.destroy();

      this.zone.run(() => {
        $('#dataTable').DataTable({
        });
      });
    });
  }



  ngOnInit() {
    this.productService.getUser().subscribe(
      (response) => {
        this.users = response.data;
      }
    );
  }

  downloadXLSX() {
    this.productService.getUser().subscribe(
      (userDataResponse) => {
        const userData = this.flattenUserData(userDataResponse.data);
        const userDataXLSXContent = this.convertToXLSX(userData);
        this.downloadFile(userDataXLSXContent, 'UserData.xlsx');
      },
      (userError) => {
        console.log('User data error: ', userError);
      }
    );
  }

  flattenUserData(data: any[]): any[] {
    const flattenedData: any[] = [];
    data.forEach((item) => {
      const userData = {
        user_id: item.user_id,
        fname: item.fname,
        lname: item.lname,
        email_id: item.email_id,
        mobile_no: item.mobile_no,
        city: item.city,
        last_login: item.updated_at,
        status: item.status,
      };
      flattenedData.push(userData);
    });
    return flattenedData;
  }

  flattenSubscriptionData(data: any[]): any[] {
    const flattenedData: any[] = [];
    data.forEach((subscription) => {
    });
    return flattenedData;
  }

  mergeUserDataAndSubscription(userData: any, subscriptionData: any[]): any {
    const mergedData = {
      ...userData,
      subscription: subscriptionData,
    };
    return mergedData;
  }

  private convertToXLSX(data: any[]): ArrayBuffer {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { fgColor: { rgb: '000000' } },
    };

    // Applying the header style to the first row (header)
    worksheet['A1'].s = headerStyle;
    worksheet['B1'].s = headerStyle;
    worksheet['C1'].s = headerStyle;
    worksheet['D1'].s = headerStyle;
    worksheet['E1'].s = headerStyle;
    worksheet['F1'].s = headerStyle;

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const buffer: ArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return buffer;
  }

  private downloadFile(content: ArrayBuffer, filename: string) {
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // downloadXLSX() {
  //   this.productService.downloadSubscription().subscribe(
  //     (response) => {
  //       const blob = new Blob([response], { type: 'application/xlsx' });
  //       const fileName = 'Subscription_Data_List.xlsx';
  //       const a = document.createElement('a');
  //       document.body.appendChild(a);
  //       a.style.display = 'none';
  //       const url = window.URL.createObjectURL(blob);
  //       a.href = url;
  //       a.download = fileName;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     (error) => {
  //       console.error('Error downloading file:', error);
  //     }
  //   );
  // }




  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }

  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }

  goBack() {
    this.back.navigateBack();
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
