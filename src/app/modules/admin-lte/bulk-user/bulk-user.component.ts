import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Papa from 'papaparse';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';



interface CsvRow {
  [key: string]: string | number;
}

@Component({
  selector: 'app-bulk-user',
  templateUrl: './bulk-user.component.html',
  styleUrls: ['./bulk-user.component.css']
})
export class BulkUserComponent {
  csvFile: File | undefined;
  tableData: CsvRow[] = [];
  tableHeaders: string[] = [];
  error_message: string = '';
  expectedHeaders: string[] = [];
  isSidebarOpen: any;

  constructor(private productService: AdminApiService,
    private adminAuth: AdminAuthService, private router: Router, private modalService: NgbModal) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.csvFile = file;
      this.error_message = '';
    }
  }

  ngOnInit() {
    this.productService.getBulkUserParams().subscribe(
      (response) => {
        this.expectedHeaders = [response.data];
      }
    );
  }



  addPackage(form: any): void {
    if (!this.csvFile) {
      this.error_message = 'Please select a CSV file.';
      return;
    }
    Papa.parse(this.csvFile, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        this.tableData = result.data as CsvRow[];
        this.tableHeaders = Object.keys(this.tableData[0]);
        const headersMatch = this.expectedHeaders.every(header => this.tableHeaders.includes(header));
        const emptyHeader = this.tableHeaders.find((header) => !header.trim());
        const headerRow = result.meta.fields;
        const emptyHeaderCell = headerRow ? headerRow.find((cell) => !cell.trim()) : undefined;
        const hasEmptyColumns = this.tableData.some(row => {
          return this.expectedHeaders.some(header => !row[header]);
        });
      },
      error: (error) => {
        console.error('CSV parsing error:', error.message);
        this.error_message = 'Error parsing CSV file.';
        this.tableData = [];
        this.tableHeaders = [];
      }
    });
  }





  SendCSV(content: any) {
    if (!this.csvFile) {
      this.error_message = 'Please select a CSV file.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.csvFile);

    this.productService.bulkUser(formData).subscribe(
      (response) => {
        this.modalService.open(content, { centered: true });
      },
      (error) => {
        console.error('Error:', error);

        if (error.status === 422 && error.error && error.error.detail) {
          this.error_message = error.error.detail;
        } else {
          this.error_message = 'An error occurred while processing the CSV file.';
        }
      }
    );
  }



  reload() {
    location.reload();
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
