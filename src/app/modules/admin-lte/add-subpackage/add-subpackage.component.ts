import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';



interface SubPackageData {
  sub_package_id: number;
  amount: number;
  sub_package_code: string;
  description: string;
  sub_package_name: string;
  status: string;
  sub_package_type: string;
}

@Component({
  selector: 'app-add-subpackage',
  templateUrl: './add-subpackage.component.html',
  styleUrls: ['./add-subpackage.component.css']
})
export class AddSubpackageComponent implements OnInit {
  subpackages: SubPackageData[] = [];
  subpackage_name: string = '';
  sub_package_code: string = '';
  description: string = '';
  amount: number = 0;
  status: string = 'ACTIVE';
  sub_package_type: string = 'STATIC';
  error_message: string = '';
  successMessage: any;
  package_id: any;
  subpackage_id: string = '';
  package_name: string = '';
  package_code: string = '';
  subpackage_data: SubPackageData | null = null;
  isUpdateForm: boolean = false;
  isSidebarOpen: any;

  constructor(
    private router: Router,
    private productService: AdminApiService,
    private adminAuth: AdminAuthService,
    private route: ActivatedRoute,
    private back: BackbuttonService
  ) {


  }

  ngOnInit() {
    this.package_id = this.route.snapshot.queryParamMap.get('package_id');
    this.route.queryParams.subscribe((params) => {
      this.subpackage_id = params['sub_package_id'];
      if (this.subpackage_id) {
        this.loadPackageData(this.package_id, this.subpackage_id);
        this.isUpdateForm = true;
      } else {
        this.addSubpackage();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }

  loadPackageData(package_id: string, subpackage_id: string): void {
    this.productService.getfilteredsubpackage(subpackage_id).subscribe(
      (response) => {
        this.subpackage_data = response.data;
        if (this.subpackage_data) {
          console.log(this.subpackage_data);
          this.subpackages[0] = { ...this.subpackages[0], ...this.subpackage_data };
        }
      }
    );
  }


  addOrUpdateSubPackage(addPackageForm: NgForm) {
    if (
      !addPackageForm.value.sub_package_name ||
      !addPackageForm.value.sub_package_code ||
      !addPackageForm.value.description ||
      !addPackageForm.value.status ||
      !addPackageForm.value.amount
    ) {
      this.error_message = 'Please fill in all fields.';
      return;
    }

    if (this.isUpdateForm && this.subpackage_data) {
      const subpackagePayload: SubPackageData = {
        sub_package_name: addPackageForm.value.sub_package_name,
        sub_package_code: addPackageForm.value.sub_package_code,
        description: addPackageForm.value.description,
        status: addPackageForm.value.status,
        amount: parseFloat(addPackageForm.value.amount),
        sub_package_id: this.subpackage_data.sub_package_id,
        sub_package_type: addPackageForm.value.sub_package_type
      };
      this.productService.updatesubPackage(subpackagePayload).subscribe((response) => {
        if (response.code === 200) {
          this.error_message = '';
          window.location.href = 'admin/subpackage-manage?package_id=' + this.package_id;
        }
      });
    } else {
      const newSubpackages: Partial<SubPackageData>[] = this.subpackages.map((subpackage) => ({
        sub_package_name: subpackage.sub_package_name,
        status: subpackage.status,
        amount: subpackage.amount,
        description: subpackage.description,
        sub_package_code: subpackage.sub_package_code,
        sub_package_type: subpackage.sub_package_type,
      }));

      const addPackagePayload = {
        package_id: this.package_id,
        subpackages: newSubpackages
      };

      this.productService.addsubPackage(addPackagePayload).subscribe((response) => {
        if (response.code === 200) {
          console.log('Sub-packages added successfully:', addPackagePayload);
          // window.location.href = 'admin/subpackage-manage?package_id=' + this.package_id;
        }
        else {
          this.error_message = response.message;
        }
      });

      addPackageForm.resetForm();
      // this.subpackages = [];
    }
  }

  goBack() {
    this.back.navigateBack();
  }

  addSubpackage() {
    if (!this.isUpdateForm) {
      const newSubpackage: SubPackageData = {
        sub_package_name: this.subpackage_name,
        sub_package_code: this.sub_package_code,
        description: this.description,
        amount: this.amount,
        status: this.status,
        sub_package_id: 0,
        sub_package_type: this.sub_package_type
      };
      this.error_message = '';
      this.subpackage_name = '';
      this.sub_package_code = '';
      this.description = '';
      this.amount = 0;
      this.status = 'ACTIVE';
      this.sub_package_type = 'STATIC';
      this.subpackages.push(newSubpackage);
    }
  }

  removeSubpackage(index: number) {
    if (!this.isUpdateForm && this.subpackages.length > 1) {
      this.subpackages.splice(index, 1);
    } else {
      this.error_message = 'You cannot delete all rows';
    }
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
