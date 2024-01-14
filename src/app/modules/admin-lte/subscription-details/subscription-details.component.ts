import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';


@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {
  subscription_id: any;
  user_id: any;
  subscriptionData: any;
  subscriptionFilterData: any = {};
  isSidebarOpen: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private back: BackbuttonService,
    private adminAuth: AdminAuthService,
    private productService: AdminApiService
  ) { }

  ngOnInit() {
    this.subscription_id = this.route.snapshot.queryParamMap.get('subscription_id');
    this.user_id = this.route.snapshot.queryParamMap.get('user_id');

    if (this.subscription_id && !this.user_id) {
      this.subscriptionFilterData.subscription_id = this.subscription_id;
    } else if (!this.subscription_id && this.user_id) {
      this.subscriptionFilterData.user_id = this.user_id;
    } else if (!this.subscription_id && !this.user_id) {
      this.router.navigate(['/subscription_manage']);
    }
    this.productService.subscriptionList(this.subscriptionFilterData).subscribe(
      (response) => {
        console.log(response);

        if (this.subscription_id && !this.user_id) {
          this.subscriptionData = response.data.response[0];
        } else if (!this.subscription_id && this.user_id) {
          this.subscriptionData = response.data.response;
        }
      },
      (error) => {
      }
    );
  }

  getAlphabetLetter(index: number): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (index >= 0 && index < alphabet.length) {
      return alphabet[index];
    }
    return '';
  }


  toggleSubtable(subscription: any): void {
    subscription.showSubtable = !subscription.showSubtable;
  }

  toggleChildSubtable(pkg: any): void {
    pkg.showChildSubtable = !pkg.showChildSubtable;
  }

  toggleCategory(category: { showCategory: boolean }): void {
    category.showCategory = !category.showCategory;
  }

  toggleSubCategory(subCategory: any): void {
    subCategory.showSubCategory = !subCategory.showSubCategory;
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
