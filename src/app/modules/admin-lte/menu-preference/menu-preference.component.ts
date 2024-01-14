import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { HttpHeaders } from '@angular/common/http';

interface CsvRow {
  [key: string]: string | number;
}

@Component({
  selector: 'app-menu-preference',
  templateUrl: './menu-preference.component.html',
  styleUrls: ['./menu-preference.component.css']
})
export class MenuPreferenceComponent {
  csvFile: File | undefined;
  tableData: CsvRow[] = [];
  tableHeaders: string[] = [];
  expectedHeaders: string[] = [];
  tableDataNew: CsvRow[] = [];
  error_message: string = '';
  isSidebarOpen: boolean = false;

  constructor(
    private productService: AdminApiService,
    private adminAuth: AdminAuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.csvFile = file;
      this.error_message = '';
    }
  }

  addPackage(): void {
    if (!this.csvFile) {
      this.error_message = 'Please select a file.';
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.tableData = XLSX.utils.sheet_to_json(ws, { header: 'A' }) as CsvRow[];

      // Check if there is at least one row in the tableData
      if (this.tableData.length > 0) {
        // Use the keys from the first row as headers
        this.tableHeaders = Object.keys(this.tableData[0]);
        console.log('tableHeaders:', this.tableHeaders);

        // Use all rows except the first as data
        this.tableDataNew = this.tableData.slice(1);
        console.log('tableDataNew:', this.tableDataNew);
      } else {
        console.error('No data found in the Excel sheet.');
      }


      const headersMatch = this.expectedHeaders.every(header => this.tableHeaders.includes(header));
      const emptyHeader = this.tableHeaders.find((header) => !header.trim());
      const hasEmptyColumns = this.tableDataNew.some(row => {
        return this.expectedHeaders.some(header => !row[header]);
      });
    };

    reader.readAsBinaryString(this.csvFile);
  }

  reload() {
    location.reload();
  }


  // SendCSV(content: any): void {
  //   if (!this.csvFile) {
  //     this.error_message = 'Please select an XLSX file.';
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', this.csvFile, this.csvFile.name);

  //   this.productService.menuPreference(formData).subscribe(
  //     () => {
  //       this.modalService.open(content, { centered: true });
  //     },
  //     (error) => {
  //       console.error('Error:', error);

  //       if (error.status === 422 && error.error && error.error.detail) {
  //         this.error_message = 'Server error: ' + error.error.detail[0];
  //       } else {
  //         this.error_message = 'An error occurred while processing the XLSX file.';
  //       }
  //     }
  //   );
  // }

  SendCSV(content: any): void {
    if (!this.csvFile) {
      this.error_message = 'Please select an XLSX file.';
      return;
    }

    this.productService.menuPreference(this.csvFile).subscribe(
      () => {
        this.modalService.open(content, { centered: true });
      },
      (error) => {
        console.error('Error:', error);

        if (error.status === 422 && error.error && error.error.detail) {
          this.error_message = 'Server error: ' + error.error.detail[0];
        } else {
          this.error_message = 'An error occurred while processing the XLSX file.';
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
