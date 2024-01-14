import { Component, HostListener } from '@angular/core';
import { BackbuttonService } from 'src/app/service/backbutton.service';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';



@Component({
  selector: 'app-delay-manage',
  templateUrl: './delay-manage.component.html',
  styleUrls: ['./delay-manage.component.css']
})
export class DelayManageComponent {
  delay_data: any[] = [];
  isSidebarOpen: any;
  constructor(
    private back: BackbuttonService,
    private router: Router,
    private adminApi: AdminApiService,
    private adminAuth: AdminAuthService,



  ) { }

  ngOnInit() {
    this.adminApi.getDelay().subscribe(
      (response) => {
        console.log(response.data);
        this.delay_data = response.data;
      }
    );
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
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
