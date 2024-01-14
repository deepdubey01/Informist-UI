import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';


@Component({
  selector: 'app-categories-manage',
  templateUrl: './categories-manage.component.html',
  styleUrls: ['./categories-manage.component.css']
})
export class CategoriesManageComponent {
  users: any[] = [];
  subpackage_id: any = '';
  isSidebarOpen: any;
  constructor(private productService: AdminApiService,
    private router: Router,
    private back: BackbuttonService,
    private adminAuth: AdminAuthService,
    private route: ActivatedRoute) {

  }


  ngOnInit() {

    this.subpackage_id = this.route.snapshot.queryParamMap.get('subpackage_id') || '';


    this.productService.getSubTopic(this.subpackage_id).subscribe(
      (response) => {
        console.log(response.data[0].categories);
        this.users = response.data[0].categories;
      }
    );
  }
  goBack() {
    this.back.navigateBack();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }

  toggleSubtable(user: any): void {
    user.showSubtable = !user.showSubtable;
  }

  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
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
