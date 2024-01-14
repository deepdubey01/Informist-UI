import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerActions } from 'ngx-bootstrap/datepicker/reducer/bs-datepicker.actions';
import { filter } from 'rxjs';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';
import { CsvDownloadService } from 'src/app/service/csv-download.service';


@Component({
  selector: 'app-subscription-manage',
  templateUrl: './subscription-manage.component.html',
  styleUrls: ['./subscription-manage.component.css']
})
export class SubscriptionManageComponent {
  user_id: any;
  subscriptionData: any;
  subscriptionFilterData: any;
  dateRange: Date[];
  preloaderImageUrl: string = 'assets/images/1488.gif';
  error_Message: any;
  isSidebarOpen: any;
  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private csvDownload: CsvDownloadService,
    private back: BackbuttonService,
    private adminAuth: AdminAuthService,
    private productService: AdminApiService
  ) {
    this.dateRange = [new Date(), new Date()];
    this.subscriptionFilterData = {
      user_id: 0,
      subscription_type: '',
      category_code: '',

      package_code: '',
      sub_package_code: '',
      subscription_until: {
        from_date: '',
        to_date: ''
      },
      amount: {
        from_amount: 0,
        to_amount: 0
      }
    };
  }

  ngOnInit() {
    const filterDataCopy = { ...this.subscriptionFilterData };

    const isSubscriptionUntilEmpty =
      filterDataCopy.subscription_until.from_date === '' && filterDataCopy.subscription_until.to_date === '';

    const isAmountEmpty =
      filterDataCopy.amount.from_amount === 0 && filterDataCopy.amount.to_amount === 0;

    if (isSubscriptionUntilEmpty) {
      delete filterDataCopy.subscription_until;
    }

    if (isAmountEmpty) {
      delete filterDataCopy.amount;
    }

    if (!isAmountEmpty) {
      filterDataCopy.amount = {
        from_amount: filterDataCopy.from_amount,
        to_amount: filterDataCopy.to_amount
      };
    }

    if (!isSubscriptionUntilEmpty) {
      filterDataCopy.subscription_until = {
        from_date: filterDataCopy.subscription_until.from_date,
        to_date: filterDataCopy.subscription_until.to_date
      };
    }

    const propertiesToCheck = ['user_id', 'subscription_type', 'category_code', 'package_code', 'sub_package_code'];

    propertiesToCheck.forEach((key) => {
      if (filterDataCopy[key] === '' || filterDataCopy[key] === undefined || filterDataCopy[key] === 0) {
        delete filterDataCopy[key];
      }
    });

    this.loading = true;
    this.productService.subscriptionList(filterDataCopy).subscribe(
      (response) => {
        this.subscriptionData = response.data.response;
        this.loading = false;
        // this.subscriptionData.forEach((subscription: { showSubtable: boolean; packages: any[]; }) => {
        //   subscription.showSubtable = false;
        //   subscription.packages.forEach((pkg: { showChildSubtable: boolean; categories: any[]; }) => {
        //     pkg.showChildSubtable = false;
        //     pkg.categories.forEach((category: { showCategory: boolean; categories: any[]; }) => {
        //       category.showCategory = false;
        //       category.categories.forEach((subCategory: { showSubCategory: boolean; }) => {
        //         subCategory.showSubCategory = false;
        //       });
        //     });
        //   });
        // });
      },
      (error) => {
        this.loading = false;
      }
    );
  }


  onSubmit() {


    const fromDate = new Date(this.subscriptionFilterData.from_date);
    const toDate = new Date(this.subscriptionFilterData.to_date);
    const fromAmount = parseFloat(this.subscriptionFilterData.from_amount);
    const toAmount = parseFloat(this.subscriptionFilterData.to_amount);

    if (fromDate > toDate) {
      this.error_Message = 'Subscription "From" date cannot be greater than "To" date.';
    }

    if (fromAmount > toAmount) {
      this.error_Message = 'Price "From" amount cannot be greater than "To" amount.';
    }


    const filterDataCopy = { ...this.subscriptionFilterData };
    const isAmountEmpty = (filterDataCopy.amount.from_amount === '' || filterDataCopy.amount.from_amount === 0) &&
      (filterDataCopy.amount.to_amount === '' || filterDataCopy.amount.to_amount === 0);
    const isSubscriptionUntilEmpty =
      filterDataCopy.subscription_until.from_date === '' && filterDataCopy.subscription_until.to_date === '';

    const propertiesToCheck = ['user_id', 'subscription_type', 'category_code', 'package_code', 'sub_package_code'];

    propertiesToCheck.forEach((key) => {
      if (filterDataCopy[key] === '' || filterDataCopy[key] === undefined || filterDataCopy[key] === 0) {
        delete filterDataCopy[key];
      }
    });

    if (!isAmountEmpty) {
      filterDataCopy.from_amount = filterDataCopy.amount.from_amount;
      filterDataCopy.to_amount = filterDataCopy.amount.to_amount;
      delete filterDataCopy.amount;
    }

    if (!isSubscriptionUntilEmpty) {
      filterDataCopy.from_date = filterDataCopy.subscription_until.from_date;
      filterDataCopy.to_date = filterDataCopy.subscription_until.to_date;
      delete filterDataCopy.subscription_until;
    }

    this.productService.subscriptionList(filterDataCopy).subscribe(
      (response) => {
        this.subscriptionData = response.data.response;
        // this.subscriptionData.forEach((subscription: { showSubtable: boolean; packages: any[]; }) => {
        //   subscription.showSubtable = false;
        //   subscription.packages.forEach((pkg: { showChildSubtable: boolean; categories: any[]; }) => {
        //     pkg.showChildSubtable = false;
        //     pkg.categories.forEach((category: { showCategory: boolean; categories: any[]; }) => {
        //       category.showCategory = false;
        //       category.categories.forEach((subCategory: { showSubCategory: boolean; }) => {
        //         subCategory.showSubCategory = false;
        //       });
        //     });
        //   });
        // });
      },
      (error) => {
        // Handle error
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


  downloadXLSX() {
    this.csvDownload.downloadCsv(this.subscriptionData, 'subcscriptionManage.csv');
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

  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }

  goBack() {
    this.back.navigateBack();
  }


  resetFilterForm() {
    location.reload();
  }

  adminlogout() {
    this.adminAuth.logout();
    this.router.navigate(['admin/admin-login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
