import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';



@Component({
  selector: 'app-dashboard-lte',
  templateUrl: './dashboard-lte.component.html',
  styleUrls: ['./dashboard-lte.component.css']
})
export class DashboardLteComponent {
  userCount: any = 0;
  packageCount: any = 0;
  isSidebarOpen: any;

  constructor(private adminapi: AdminApiService, private router: Router, private productService: ProductService, private adminAuth: AdminAuthService) { }


  ngOnInit() {
    this.adminapi.getUser().subscribe(
      (response) => {

        this.userCount = response.data.length;
      }
    );
    this.productService.getCategories().subscribe(
      (response) => {

        this.packageCount = response.data.length;
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
