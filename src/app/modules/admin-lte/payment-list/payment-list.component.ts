import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent {

  tableHeaders: string[] = [];
  error_message: string = '';
  expectedHeaders: string[] = [];
  isSidebarOpen: any;

  constructor(private productService: AdminApiService,
    private adminAuth: AdminAuthService, private router: Router) { }

  ngOnInit() {
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
