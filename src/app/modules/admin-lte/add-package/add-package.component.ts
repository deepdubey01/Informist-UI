import { Component, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';



interface DelayInput {
  delay_id: string;
  amount: number;
  amount_type: string;
}


interface PackageData {
  package_id: number;
  full_service_month: string;
  package_code: string;
  package_name: string;
  delays: DelayInput[];
}

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})
export class AddPackageComponent {
  package_name: string = '';
  package_code: string = '';
  full_service_month: any;
  part_service_month: any;
  status: string = "ACTIVE"; // Set a default value for the select element
  discount_monthly: any;
  discount_quarterly: any;
  discount_yearly: any;
  amount: any;
  feed_amount: any;
  feed_live_amount: any = 0;
  description: string = '';
  error_message: string = '';
  amount_type: string = '';
  delayNameOptions: any[] = [];
  delay_name: string = '';
  delay_id: string = '';
  package_data: any;
  package_id: any;
  delayInputs: DelayInput[] = [{ delay_id: '', amount: 0, amount_type: 'inPercentage' }];
  isSidebarOpen: any;

  constructor(private adminAPI: AdminApiService,
    private router: Router,
    private route: ActivatedRoute,
    private adminAuth: AdminAuthService,
    private back: BackbuttonService
  ) { }

  packageData = {
    package_name: '',
    package_code: '',
    description: '',
    full_service_month: 0,
    part_service_month: 0,
    status: 'ACTIVE',
    discount_monthly: 0,
    discount_quarterly: 0,
    discount_yearly: 0,
    amount: 0,
    feed_amount: 0,
    feed_live_amount: 0,
  };



  ngOnInit(): void {
    this.adminAPI.getDelay().subscribe(
      (getdelayresponse) => {
        this.delayNameOptions = getdelayresponse.data;
      },
      (error) => {
        this.error_message = "Error";
      }
    );
    this.route.queryParams.subscribe(params => {
      this.package_id = params['package_id'];
      if (this.package_id) {
        this.loadPackageData(this.package_id);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }
  goBack(): void {
    this.back.navigateBack();
  }
  loadPackageData(package_id: any): void {
    this.adminAPI.getfilteredCategories(package_id).subscribe(
      (response) => {
        if (Array.isArray(response.data.delay)) {
          this.delayInputs = [];
          this.delayInputs = response.data.delay;
          console.log(JSON.stringify(this.delayInputs));

        }
        this.package_name = response.data.package_name;
        this.package_code = response.data.package_code;
        this.full_service_month = response.data.full_service_month;
        this.feed_amount = response.data.feed_amount;
        this.feed_live_amount = response.data.feed_live_amount;
        this.discount_monthly = response.data.discount_monthly;
        this.discount_quarterly = response.data.discount_quarterly;
        this.discount_yearly = response.data.discount_yearly;
        this.description = response.data.description;
        this.part_service_month = response.data.part_service_month;
        this.status = response.data.status;
      }
    );
  }


  addDelayInput() {
    this.delayInputs.push({ delay_id: '', amount: 0, amount_type: 'inPercentage' });
  }

  deleteDelayInput(index: number) {
    this.delayInputs.splice(index, 1);
  }

  addPackage(packageData: NgForm) {

    const formValues = packageData.value;
    if (formValues.package_name === '' || formValues.full_service_month === '' || formValues.discount_quarterly === '') {
      this.error_message = 'Fill all the input fields to proceed..!!';
    }
    else {

      const delayInputsArray: DelayInput[] = [];
      const formValuesWithDelay = {
        ...formValues,
        delay: delayInputsArray,
      };

      if (formValues.feed_live_amount === '') {
        this.error_message = 'Feed Live Amount can not be empty';
      } else {
        if (this.package_id) {
          formValuesWithDelay.package_id = this.package_id;
          console.log(formValuesWithDelay);
          this.adminAPI.updatePackage(formValuesWithDelay).subscribe(
            (response) => {
              if (response.code == 200) {
                window.location.href = 'admin/package-manage';
                console.log(response);
              } else if (response.code == 400) {
                this.error_message = response.message;
              }
            },
            (error) => {
              this.error_message = 'Update error';
              console.log(error);
            }
          );
        } else {
          console.log(formValuesWithDelay);
          this.adminAPI.addPackage(formValuesWithDelay).subscribe(
            (response) => {
              if (response.code == 200) {
                this.error_message = '';
                window.location.href = 'admin/package-manage';
              } else if (response.code == 400) {
                this.error_message = response.message;
              }
            },
            (error) => {
              this.error_message = 'Submission error';
            }
          );
        }
      }
    }



  }



  // addPackage(packageData: NgForm) {
  //   const formValues = packageData.value;

  //   const delayInputsArray = [];
  //   for (const delayInput of this.delayInputs) {
  //     const delayObject = {
  //       delay_id: delayInput.delay_id,
  //       amount: delayInput.amount,
  //       amount_type: delayInput.amount_type,
  //     };

  //     delayInputsArray.push(delayObject);
  //   }

  //   const formValuesWithDelay = {
  //     ...formValues, // Copy other properties from formValues
  //     delay: delayInputsArray, // Add the delay array
  //   };

  //   console.log(formValuesWithDelay);

  //   if (this.package_id) {

  //     formValuesWithDelay.package_id = this.package_id;
  //     console.log(JSON.stringify(formValuesWithDelay));

  //     this.adminAPI.updatePackage(formValuesWithDelay).subscribe(
  //       (response) => {
  //         if (response.code == 200) {
  //           window.location.href = 'admin/package-manage';
  //           console.log(response);
  //         } else if (response.code == 400) {
  //           this.error_message = response.message;
  //         }
  //       },
  //       (error) => {
  //         this.error_message = 'Update error';
  //       }
  //     );
  //   } else {
  //     this.adminAPI.addPackage(formValuesWithDelay).subscribe(
  //       (response) => {
  //         if (response.code == 200) {
  //           console.log(response);

  //         } else if (response.code == 400) {
  //           this.error_message = response.message;
  //         }
  //       },
  //       (error) => {
  //         this.error_message = 'Submission error';
  //       }
  //     );
  //   }
  // }

  adminlogout() {
    this.adminAuth.logout();
    this.router.navigate(['admin/admin-login']);
    console.log(this.adminAuth.getAdminToken());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

