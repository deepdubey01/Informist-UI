import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { TextTransformService } from 'src/app/text-transform.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';
import { LoaderService } from 'src/app/loader.service';

interface Categories {
  category_id: string;
  category_code: string;
  category_name: string;
  selected: boolean;
  amount: number;
  expanded: boolean;
  categories?: Categories[];
}


interface Company {
  company_id: string;
  company_name: string;
  selected: boolean;
  amount: number;
}

interface Sub_Package {
  companies: any;
  sub_package_id: string;
  sub_package_name: string;
  expanded: boolean;
  selected: boolean;
  description: string;
  amount: number;
  sub_package_type: string;
  categories?: Categories[];
}

@Component({
  selector: 'app-select-free-product-topic',
  templateUrl: './select-free-product-topic.component.html',
  styleUrls: ['./select-free-product-topic.component.css'],
})
export class SelectFreeProductTopicComponent implements OnInit {
  package_id: any = '';
  user_id: any = '';
  selectedCategories: { [subPackageId: number]: number } = {};
  isFullSummaryType: boolean = false;
  responseData: Sub_Package[] = [];
  subscription_type: any = '';
  package_name: string = '';
  isFullSummary: boolean = false;
  summary_type: any = [];
  totalAmount: number = 0;
  searchText: string = '';
  package_delay_id: string = '';
  selectedFeedType: string = 'LIVE';
  selectedPackageDelayId: string = '';
  filtered_package: any[] = [];
  newSummary: string = '';
  companies: any;
  companyNames: any;
  selectedCompanies: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private textTransform: TextTransformService,
    private productService: ProductService,
    private loader: LoaderService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.productService.getCompanies().subscribe(
      (response) => {
        console.log(this.companies);
        this.companies = response.slice(0, 10);
        localStorage.setItem('companies', JSON.stringify(response));
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
    this.package_id = localStorage.getItem('package_id');
    this.subscription_type = localStorage.getItem('subscription_type');
    this.summary_type = localStorage.getItem('summary_type');
    if (this.summary_type === 'FULL' || this.summary_type === 'full') {
      this.isFullSummaryType = true;
      this.navigateToSummaryAfterDelay();
    }
    this.newSummary = this.textTransform.transformText(this.summary_type);
    this.productService.getfilteredCategories(this.package_id).subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.filtered_package = response.data.delay;
      }
    );

    this.productService.getTopic(this.package_id)
      .pipe(
        catchError((error) => {
          console.error('Error fetching main topics:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          const selectedDataString = localStorage.getItem('selected_data');
          const selectedData: Sub_Package[] = selectedDataString ? JSON.parse(selectedDataString) : [];
          this.responseData = data.data;
          if (selectedData.length === 0) {
            this.responseData.forEach((sub_package: Sub_Package) => {
              sub_package.expanded = true;
              sub_package.selected = true;
              this.productService.getSubTopic(sub_package.sub_package_id)
                .pipe(
                  catchError((error) => {
                    console.error('Error fetching subtopics:', error);
                    return of(null);
                  })
                )
                .subscribe((subtopicData) => {
                  if (subtopicData) {
                    const categoriesData = subtopicData.data[0];
                    sub_package.categories = categoriesData && categoriesData.categories ? categoriesData.categories : [];
                    if (sub_package.categories) {
                      sub_package.categories.forEach((category) => {
                        category.selected = true;
                        if (category.categories) {
                          category.categories.forEach((subcategory) => {
                            subcategory.selected = true;
                          });
                        }
                      });
                    }

                    this.calculateTotalAmount();
                  }
                });
            });
          } else {
            this.responseData.forEach((sub_package: Sub_Package) => {
              sub_package.expanded = true;
              const selectedSubPackage = selectedData.find(item => item.sub_package_id === sub_package.sub_package_id);

              if (selectedSubPackage) {
                sub_package.selected = true;
                this.productService.getSubTopic(sub_package.sub_package_id)
                  .pipe(
                    catchError((error) => {
                      console.error('Error fetching subtopics:', error);
                      return of(null);
                    })
                  )
                  .subscribe((subtopicData) => {
                    if (subtopicData) {
                      const categoriesData = subtopicData.data[0];
                      sub_package.categories = categoriesData && categoriesData.categories ? categoriesData.categories : [];

                      if (sub_package.categories) {
                        sub_package.categories.forEach((category) => {
                          const selectedCategory = (selectedSubPackage.categories || []).find(selectedCat => selectedCat.category_id === category.category_id);
                          if (selectedCategory) {
                            category.selected = true;
                            if (category.categories) {
                              category.categories.forEach((subcategory) => {
                                const selectedSubcategory = (selectedCategory.categories || []).find(selectedSubcat => selectedSubcat.category_id === subcategory.category_id);
                                if (selectedSubcategory) {
                                  subcategory.selected = true;
                                }
                              });
                            }
                          }
                        });
                      }

                      this.calculateTotalAmount();
                    }
                  });
              }
            });
          }
        }
      });



    const selectedDataString = localStorage.getItem('selected_data');
    if (selectedDataString) {
      const selectedData: Sub_Package[] = JSON.parse(selectedDataString);
      this.selectDataFromLocalStorage(selectedData);
    }
  }

  selectDataFromLocalStorage(selectedData: Sub_Package[]) {
    selectedData.forEach((selectedSubPackage) => {
      const subPackage = this.responseData.find(
        (item) => item.sub_package_id === selectedSubPackage.sub_package_id
      );

      if (subPackage) {
        subPackage.selected = true;

        if (selectedSubPackage.categories) {
          selectedSubPackage.categories.forEach((selectedCategory) => {
            const category = subPackage.categories?.find(
              (cat) => cat.category_id === selectedCategory.category_id
            );

            if (category) {
              category.selected = true;

              if (selectedCategory.categories) {
                selectedCategory.categories.forEach((selectedSubcategory) => {
                  const subcategory = category.categories?.find(
                    (subcat) => subcat.category_id === selectedSubcategory.category_id
                  );

                  if (subcategory) {
                    subcategory.selected = true;
                  }
                });
              }
            }
          });
        }
      }
    });

    this.calculateTotalAmount();
  }


  onFeedTypeChange(selectedType: string) {
    this.selectedFeedType = selectedType;
  }

  onPackageDelayIdChange(newPackageDelayId: string) {
    this.selectedPackageDelayId = newPackageDelayId;
  }

  calculateTotalAmount() {
    this.totalAmount = this.responseData.reduce((total, sub_package) => {
      if (sub_package.selected) {
        let subPackageAmount = sub_package.amount;
        if (sub_package.categories) {
          const selectedCategories = sub_package.categories.filter((category) => category.selected);
          if (selectedCategories.length > 0) {
            const categoryTotal = selectedCategories.reduce((catTotal, category) => {
              catTotal += category.amount;
              return catTotal;
            }, 0);

            if (categoryTotal > subPackageAmount) {
              subPackageAmount = sub_package.amount;
            } else {
              subPackageAmount = categoryTotal;
            }
          }
        }
        total += subPackageAmount;
      }

      return total;
    }, 0);
  }

  initializeCheckboxes(sub_package: Sub_Package) {
    sub_package.selected = true;
    if (sub_package.categories) {
      sub_package.categories.forEach((category: Categories) => {
        this.initializeCategoryCheckboxes(category);
      });
    }
  }

  isAtLeastOneSubPackageSelected(): boolean {
    return this.responseData.some((sub_package) => sub_package.selected);
  }

  initializeCategoryCheckboxes(category: Categories) {
    category.selected = true;
    if (category.selected) {
      category.expanded = true;
    } else {
      category.expanded = false;
    }
    if (Array.isArray(category.categories)) {
      category.categories.forEach((subcategory: Categories) => {
        this.initializeCategoryCheckboxes(subcategory);
      });
    }

    if (category.category_code == '1company') {
      category.selected = false;
      category.expanded = false;
    } else if (category.category_code == '5companies') {
      category.selected = false;
      category.expanded = false;
    } else if (category.category_code == '10companies') {
      category.selected = false;
      category.expanded = false;
    }
  }

  onSubPackageSelect(sub_package: Sub_Package) {
    sub_package.selected = !sub_package.selected;
    if (sub_package.selected) {
      sub_package.categories?.forEach((category) => {
        category.selected = true;
        if (category.categories) {
          category.categories.forEach((subcategory) => {
            subcategory.selected = false;
          });
        }
      });
    } else {
      sub_package.categories?.forEach((category) => {
        category.selected = true;
        console.log(`Selected Category: ${category.category_name}`);
        console.log(`Category ID: ${category.category_id}`);
        if (category.categories) {
          category.categories.forEach((subcategory) => {
            subcategory.selected = false;
          });
        }
      });
    }
    this.calculateTotalAmount();
  }



  onCategorySelect(category: Categories) {
    category.selected = !category.selected;
    if (category.selected) {
      console.log(`Selected Category: ${category.category_name}`);
      console.log(`Category ID: ${category.category_id}`);
    }
  }

  checkCategoryCheckboxes(categories: Categories[] | undefined) {
    if (categories) {
      categories.forEach((category) => {
        category.selected = false;
        console.log(`Selected Category: ${category.category_name}`);
        console.log(`Category ID: ${category.category_id}`);
        this.checkCategoryCheckboxes(category.categories);
      });
    }
  }

  checkAllCheckboxes() {
    this.responseData.forEach((item) => {
      item.selected = false;
      this.checkCategoryCheckboxes(item.categories);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onCheckboxClick(event: Event, sub_package: Sub_Package, category: Categories) {
    event.stopPropagation();

    if (this.isFullSummary) {
      sub_package.selected = true;
      return;
    }
    category.selected = !category.selected;
    const anyCategorySelected = sub_package.categories?.some((cat) => cat.selected);
    if (category.selected && anyCategorySelected) {
      sub_package.selected = true;
    } else if (!category.selected && !anyCategorySelected) {
      sub_package.selected = false;
    }
    if (category.selected) {
      category.expanded = true;
      console.log(`Selected Category: ${category.category_name}`);
      console.log(`Category ID: ${category.category_id}`);
    } else {
      category.expanded = false;
    }
    this.calculateTotalAmount();
  }




  onSubcategoryClick(subcategory: Categories) {
    if (this.isFullSummary) {
      return;
    }
    subcategory.selected = !subcategory.selected;
    this.calculateTotalAmount();
    if (subcategory.selected) {
      console.log(`Selected Subcategory: ${subcategory.category_name}, Amount: ₹${subcategory.amount}`);
    }
  }

  onCompanySelectionChange(company: any) {
    if (company.selected) {
      this.selectedCompanies.push(company);
    } else {
      const index = this.selectedCompanies.indexOf(company);
      if (index !== -1) {
        this.selectedCompanies.splice(index, 1);
      }
    }
  }

  navigateToSummary(): void {
    const selectedTopics: Sub_Package[] = this.responseData
      .filter((sub_package) => sub_package.selected)
      .map((sub_package) => ({
        ...sub_package,
        categories: sub_package.categories ? sub_package.categories.filter((category) => category.selected) : [],
      }));
    const jsonData: string = JSON.stringify(selectedTopics);
    localStorage.setItem('selected_data', jsonData);
    localStorage.setItem('package_id', this.package_id);
    localStorage.setItem('summary_type', this.summary_type);
    localStorage.setItem('feed_type', this.selectedFeedType);
    localStorage.setItem('package_delay_id', this.selectedPackageDelayId);
    localStorage.setItem('selected_companies', JSON.stringify(this.selectedCompanies));
    this.router.navigate(['free-trial-summary']);
  }

  navigateToSummaryAfterDelay(): void {
    setTimeout(() => {
      this.navigateToSummary();
    }, 1100);
  }

  isDynamicSubPackage(sub_package: Sub_Package): boolean {
    return sub_package.sub_package_type === 'DYNAMIC';
  }


  limitCompanySelection(category: Categories, maxCompanies: number) {
    if (category.categories && category.categories.length > maxCompanies) {
      category.categories.forEach((subcategory, index) => {
        if (index >= maxCompanies) {
          subcategory.selected = false;
          subcategory.expanded = false;
        }
      });
    }
  }



  async onSearchChange(event: Event) {
    if (event instanceof InputEvent) {
      const inputElement = event.target as HTMLInputElement;
      this.searchText = inputElement.value;
      if (this.searchText.length >= 2) {
        try {
          const response = await this.productService.getCompanieswithName(this.searchText).toPromise();
          if (response) {
            this.companies = response.slice(0, 15);
            localStorage.setItem('companies', JSON.stringify(response));
          } else {
            console.error('API response is undefined or empty.');
          }
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
      }
    }
  }


  getCategoryCodeNumber(categoryCode: string): number {
    const match = categoryCode.match(/\d+/) || '';
    if (match) {
      return parseInt(match[0], 10);
    }
    return 0;
  }


}
