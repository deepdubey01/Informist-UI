import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';


interface Category {
  category_id?: number;
  category_name: string;
  amount: string;
  description: string;
  category_code: string;
  status: string;
  categories?: Category[];
}

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})
export class AddCategoriesComponent {
  subpackage_id: string = '';
  category_id: any = '';
  isUpdateForm: boolean = false;
  mainCategory: Category = {
    category_id: 0,
    category_name: '',
    amount: '0',
    description: '',
    category_code: '',
    status: 'ACTIVE'
  };
  categories: Category[] = [];
  isSidebarOpen: any;
  constructor(
    private route: ActivatedRoute,
    private productService: AdminApiService,
    private adminAuth: AdminAuthService,
    private back: BackbuttonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subpackage_id = this.route.snapshot.queryParamMap.get('subpackage_id') || '';
    this.route.queryParams.subscribe((params) => {
      this.category_id = params['category_id'];
      if (this.category_id) {
        this.loadPackageData(this.category_id, this.subpackage_id);
      } else {
        this.addSubcategory();
      }
    });

    if (this.subpackage_id) {
      this.loadPackageData(this.category_id, this.subpackage_id);
      this.isUpdateForm = true;
    }
  }

  loadPackageData(category_id: number, sub_package_id: string) {
    this.productService.getSubTopic(sub_package_id).subscribe(
      (response) => {
        const categoryDataNew = response.data[0];
        if (categoryDataNew && categoryDataNew.categories) {
          this.categories = categoryDataNew.categories.filter(
            (category: Category) => category.category_id == category_id
          );
          console.log(this.categories);
          if (this.categories.length > 0) {
            console.log(this.categories);
            this.mainCategory = { ...this.categories[0] };
          }
        }
      }
    );
  }

  onSubmit() {
    if (this.category_id !== null && this.category_id !== undefined) {
      const payload = {
        category_id: this.category_id,
        category_name: this.mainCategory.category_name,
        status: this.mainCategory.status,
        parent_id: 0,
        amount: Number(this.mainCategory.amount),
        description: this.mainCategory.description,
        category_code: this.mainCategory.category_code,
      };

      console.log('Update Payload:', payload);

      this.productService.updateCategories(payload).subscribe((response) => {
        if (response.code === 200) {
          this.router.navigate(['admin/categories-manage'], {
            queryParams: { subpackage_id: this.subpackage_id },
          });
        }
      });
    } else {
      const newCategory: Category = {
        category_name: this.mainCategory.category_name,
        status: this.mainCategory.status,
        amount: this.mainCategory.amount,
        description: this.mainCategory.description,
        category_code: this.mainCategory.category_code,
        categories: this.mainCategory.categories,
      };
      const payload = {
        subpackage_id: this.subpackage_id,
        categories: [newCategory],
      };
      this.productService.addCategories(payload).subscribe((response) => {
        if (response.code === 200) {
          this.router.navigate(['admin/categories-manage'], {
            queryParams: { subpackage_id: this.subpackage_id },
          });
        }
      });
    }
  }


  addSubcategory() {
    console.log('Adding subcategory');
    const newSubcategory: Category = {
      category_id: 0,
      category_name: '',
      amount: '0',
      description: '',
      category_code: '',
      status: 'ACTIVE'
    };

    if (this.mainCategory.categories) {
      this.mainCategory.categories = [...this.mainCategory.categories, newSubcategory];
    } else {
      this.mainCategory.categories = [newSubcategory];
    }
  }


  removeSubcategory(subcategoryIndex: number) {
    if (this.mainCategory.categories) {
      this.mainCategory.categories.splice(subcategoryIndex, 1);
    }
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
