import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../mat-design/confirmation-dialog/confirmation-dialog.component';
import { AdminApiService } from 'src/app/service/admin-api.service';
import * as XLSX from 'xlsx';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-package-manage',
  templateUrl: './package-manage.component.html',
  styleUrls: ['./package-manage.component.css']
})
export class PackageManageComponent implements OnInit {
  users: any[] = [];
  i: number = 0;
  isActive: boolean = false;
  isSidebarOpen: boolean = false;
  constructor(
    private productService: AdminApiService,
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private adminAuth: AdminAuthService,
    private adminAPI: AdminApiService,
    private back: BackbuttonService) {

  }

  ngOnInit() {
    this.productService.getadminCategories().subscribe(
      (response) => {
        console.log(response.data);
        this.users = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  downloadXLSX() {
    this.productService.getadminCategories().subscribe(
      (response) => {
        const data = this.flattenData(response.data);
        const xlsxContent = this.convertToXLSX(data);
        this.downloadFile(xlsxContent, 'Package_List.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  flattenData(data: any[]): any[] {
    const flattenedData: any[] = [];
    data.forEach((item) => {
      const packageData = {
        package_id: item.package_id,
        package_name: item.package_name,
        package_code: item.package_code,
        description: item.description,
        full_service_month: item.full_service_month,
        part_service_month: item.part_service_month,
        status: item.status,
      };
      if (item.delay && item.delay.length > 0) {
        item.delay.forEach((delay: { delay_id: any; amount: any; delay_name: any; no_of_minutes: any; amount_type: any; }) => {
          const delayData = {
            delay_id: delay.delay_id,
            amount: delay.amount,
            delay_name: delay.delay_name,
            no_of_minutes: delay.no_of_minutes,
            amount_type: delay.amount_type,
          };
          const mergedData = { ...packageData, ...delayData };
          flattenedData.push(mergedData);
        });
      } else {
        flattenedData.push(packageData);
      }
    });
    return flattenedData;
  }

  private convertToXLSX(data: any[]): ArrayBuffer {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { fgColor: { rgb: '000000' } },
    };

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const buffer: ArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return buffer;
  }

  private downloadFile(content: ArrayBuffer, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }


  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'badge bg-success' : 'badge bg-danger';
  }

  goBack(): void {
    this.back.navigateBack();
  }

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

  printStatus(packageId: number, status: string): void {
    let newStatus: string;
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
        const updateData = { package_id: packageId, status: newStatus };
        this.adminAPI.updatePackage(updateData).subscribe(
          (response) => {
            if (response.code === 200) {
              window.location.reload();
            }
          }
        );
      }
    }
    );



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
