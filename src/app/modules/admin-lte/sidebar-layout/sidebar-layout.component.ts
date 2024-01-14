import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/service/admin-auth.service';



@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',

  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {
  isMenuOpen = false;
  isSubmenuOpen: boolean = false;
  isSidebarOpen: boolean = false;
  allPackage: any[] = [];

  ngOnInit() {
    const storedPackages = localStorage.getItem('allpackage');
    if (storedPackages) {
      this.allPackage = JSON.parse(storedPackages);
    }
  }



  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(private router: Router,
    private adminAuth: AdminAuthService) { }

  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }

  navigateToSubpackage(packageId: string) {
    window.location.href = `admin/subpackage-manage?package_id=${packageId}`;
  }


  adminlogout() {
    this.adminAuth.logout();
    this.router.navigate(['admin/admin-login']);
    console.log(this.adminAuth.getAdminToken());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSubmenu(event: Event) {
    event.preventDefault();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }


  navigateToAllpackage() {
    window.location.href = 'admin/package-manage'
  }
}
