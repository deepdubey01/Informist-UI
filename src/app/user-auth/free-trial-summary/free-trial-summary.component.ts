import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/api.service';
import { ToastService } from 'src/app/toast.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



interface Categories {
  selected: boolean;
  category_id: string;
  category_name: string;
  categories?: Categories[];
  net_amount: number; // Add this property
}

interface Topic {
  sub_package_id: string;
  sub_package_name: string;
  categories: Categories[];
  created_at: string;
  updated_at: string;
  status: string;
  expanded: boolean;
  selected: boolean;
  sub_package_type: string;
  amount: number; // Add this property
  type: string;
}


@Component({
  selector: 'app-free-trial-summary',
  templateUrl: './free-trial-summary.component.html',
  styleUrls: ['./free-trial-summary.component.css']
})
export class FreeTrialSummaryComponent implements OnInit {
  @ViewChild('freeTrialModal') freeTrialModal: any;
  selectedTopics: Topic[] = [];
  package_id: number = 0;
  user_id: any = 0;
  error_message: any = '';
  summary_type: string = '';
  topics: Topic[] = [];
  package_type: any;
  feed_type: any;
  package_delay_id: any = '0';
  datasummary: string = '';
  discountPrice: number = 0;
  responseData: any = '';
  jsonData: string = '';
  selectedCompanies: any = {};
  subscriptionData: any = '';
  selectedPackage: string = 'MONTHLY';
  netAmount: number = 0;
  disAmount: number = 0;
  afterdisAmount: number = 0;
  gstAmount: number = 0;
  totalAmount: number = 0;
  issummaryType: boolean = false;
  package_name: string = '';
  yearlyPrice: number = 0;
  yearlydelayPrice: number = 0;
  showSuccessModal: boolean = false;
  monthlyPrice: number = 0;
  monthlydelayPrice: number = 0;
  quarterlyPrice: number = 0;
  quarterlydelayPrice: number = 0;
  priceDetails: any = [];
  quarterlyDPrice: number = 0;
  yearlyDPrice: number = 0;
  priceData: any = {};
  newtrialMode: boolean = false;
  subscription_type: any;
  monthlyDPrice: number = 0;
  mainAmount: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public toastService: ToastService,
    private modal: NgbModal,
    private productservice: ProductService,
    private authService: AuthenticationService

  ) { }

  ngOnInit() {
    this.package_id = parseInt(localStorage.getItem('package_id') || '', 10);
    this.summary_type = localStorage.getItem('summary_type') || '';
    this.feed_type = localStorage.getItem('feed_type') || '';
    this.package_delay_id = localStorage.getItem('package_delay_id') || '0';
    this.subscription_type = localStorage.getItem('subscription_type');
    this.package_id = parseInt(localStorage.getItem('package_id') || '', 10);
    this.summary_type = localStorage.getItem('summary_type') || '';
    const selectedData = localStorage.getItem('selected_data');
    const selectedCompaniesData = localStorage.getItem('selected_companies');

    if (selectedCompaniesData !== null) {
      this.selectedCompanies = JSON.parse(selectedCompaniesData);
    }


    if (selectedData) {
      this.selectedTopics = JSON.parse(selectedData);
    }

    if (this.summary_type === 'FULL' || this.summary_type === 'full') {
      this.issummaryType = true;
    }


    this.productservice.subscriptionList().subscribe(
      (response) => {
        if (response.data.response.length === 0) {
          this.subscription_type = 'TRIAL';
          this.newtrialMode = true;
        } else {
          this.subscription_type = 'PAID';
        }
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error('Error fetching subscription data:', error);
      }
    );

    this.productservice.getCategories().subscribe(
      (response: { data: Array<{ package_id: number, package_name: string }> }) => {
        const desiredPackageId: number = Number(this.package_id);
        const packageItem = response.data.find((item: { package_id: number }) => item.package_id === desiredPackageId);
        if (packageItem) {
          this.package_name = packageItem.package_name;
        }
      }
    );

    const priceData = {
      packages: [
        {
          package_id: this.package_id,
          service_type: this.summary_type || "",
          feed_type: this.feed_type,
          package_delay_id: this.package_delay_id,
          subpackages: this.selectedTopics.map((selectedTopic) => ({
            subpackage_id: selectedTopic.sub_package_id,
            service_type: this.printTopicType(selectedTopic),
            categories: selectedTopic.categories
              ? selectedTopic.categories.map((categories) => {
                if (categories.category_id !== undefined && categories.category_id !== null && categories.category_id !== "") {
                  return {
                    category_id: categories.category_id,
                    service_type: this.printSubtopicType(categories) || "",
                    categories: categories.categories
                      ? categories.categories.map((subCategories) => {
                        if (subCategories.category_id !== undefined && subCategories.category_id !== null && subCategories.category_id !== "") {
                          return {
                            category_id: subCategories.category_id,
                            service_type: this.printSubtopicType(subCategories) || "",
                          };
                        }
                        return null;
                      }).filter(Boolean)
                      : [],
                  };
                }
                return null;
              }).filter(Boolean)
              : [],
          })),
        },
      ],
    };


    this.jsonData = JSON.stringify(priceData);

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        header.classList.toggle('active');
        const accordionContent = header.nextElementSibling as HTMLElement;

        if (accordionContent.style.display === 'block') {
          accordionContent.style.display = 'none';
        } else {
          accordionContent.style.display = 'block';
        }
      });
    });

    this.productservice.topicPrices(priceData).subscribe(
      (response) => {
        if (response.code == 200) {
          this.priceDetails = response.data[this.package_id];
          if (this.priceDetails) {
            this.monthlyPrice = this.priceDetails.monthly.total_amount;
            this.quarterlyPrice = this.priceDetails.quarterly.total_amount;
            this.yearlyPrice = this.priceDetails.yearly.total_amount;
            this.netAmount = this.priceDetails.monthly.net_amount;
            this.gstAmount = this.priceDetails.monthly.gst;
            this.disAmount = this.priceDetails.monthly.discount;
            this.totalAmount = this.priceDetails.monthly.total_amount;
            this.afterdisAmount = this.netAmount - this.disAmount;
          }
        } else if (response.code == 400) {
          console.error('Error:', response.message);
        }
      },
      (error) => {
        console.error('Pricing failed:', error);
      }
    );


    if (this.subscription_type === 'trial' || this.subscription_type === 'TRIAL') {
      this.newtrialMode = true;
    }

    this.selectedPackage = 'MONTHLY';
    this.printPricingDetails(this.selectedPackage);


  }

  printPricingDetails(selectedPackage: string) {
    switch (selectedPackage) {
      case 'MONTHLY':
        this.netAmount = this.priceDetails.monthly.tenure_amount;
        this.gstAmount = this.priceDetails.monthly.gst;
        this.disAmount = this.priceDetails.monthly.discount;
        this.totalAmount = this.priceDetails.monthly.total_amount;
        this.afterdisAmount = this.netAmount - this.disAmount;
        break;
      case 'QUARTERLY':
        this.netAmount = this.priceDetails.quarterly.tenure_amount;
        this.gstAmount = this.priceDetails.quarterly.gst;
        this.disAmount = this.priceDetails.quarterly.discount;
        this.totalAmount = this.priceDetails.quarterly.total_amount;
        this.afterdisAmount = this.netAmount - this.disAmount;
        break;
      case 'YEARLY':
        this.netAmount = this.priceDetails.yearly.tenure_amount;
        this.gstAmount = this.priceDetails.yearly.gst;
        this.disAmount = this.priceDetails.yearly.discount;
        this.totalAmount = this.priceDetails.yearly.total_amount;
        this.afterdisAmount = this.netAmount - this.disAmount;
        break;
      default:
        this.netAmount = this.priceDetails.monthly.tenure_amount;
        this.gstAmount = this.priceDetails.monthly.gst;
        this.disAmount = this.priceDetails.monthly.discount;
        this.totalAmount = this.priceDetails.monthly.total_amount;
        this.afterdisAmount = this.netAmount - this.disAmount;
        break;
    }


  }


  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }

  private extractSelectedSubtopics(selectedTopics: Topic[]): Categories[] {
    const selectedSubtopics: Categories[] = [];
    selectedTopics.forEach(topic => {
      if (topic.categories) {
        topic.categories.forEach(child_topic => {
          if (child_topic.selected) {
            selectedSubtopics.push(child_topic);
          }
        });
      }
    });
    return selectedSubtopics;
  }

  printTopicType(topic: Topic): string {
    if (topic.categories && topic.categories.length > 0) {
      return 'AL_CARTE';
    } else {
      return 'FULL';
    }
  }

  printSubtopicType(subtopic: Categories): string {
    if (subtopic.categories && subtopic.categories.length > 0) {
      return 'AL_CARTE';
    } else {
      return 'FULL';
    }
  }





  openVerticallyCentered(content: any) {
    const selectedCompanies = localStorage.getItem('selected_companies');
    const companyArray = JSON.parse(selectedCompanies || '[]');

    const symbols: any[] = [];

    for (const companyObj of companyArray) {
      if (companyObj.symbol) {
        symbols.push(companyObj.symbol);
      }
    }

    const subscribeData = {
      subscription_type: this.subscription_type,
      packages: [
        {
          package_id: this.package_id,
          package_type: this.selectedPackage,
          service_type: this.summary_type,
          feed_type: this.feed_type,
          package_delay_id: this.package_delay_id || 0,
          subpackages: this.selectedTopics.map((selectedTopic) => {
            const subpackageData: {
              subpackage_id: string;
              service_type: string;
              categories?: {
                category_id: string;
                service_type: string;
                company?: string;
                categories?: {
                  category_id: string;
                  service_type: string;
                }[];
              }[];
            } = {
              subpackage_id: selectedTopic.sub_package_id,
              service_type: this.printTopicType(selectedTopic),
            };

            if (selectedTopic.sub_package_type === 'DYNAMIC') {
              subpackageData.categories = selectedTopic.categories
                ? selectedTopic.categories.map((subtopic) => ({
                  category_id: subtopic.category_id,
                  service_type: this.printSubtopicType(subtopic),
                  companies: symbols.length > 0 ? symbols.map((symbol) => ({ symbol })) : [],
                }))
                : [];
            } else {
              subpackageData.categories = selectedTopic.categories
                ? selectedTopic.categories.map((subtopic) => ({
                  category_id: subtopic.category_id,
                  service_type: this.printSubtopicType(subtopic),
                  categories: subtopic.categories
                    ? subtopic.categories.map((categories) => ({
                      category_id: categories.category_id,
                      service_type: this.printSubtopicType(categories),
                    }))
                    : [],
                }))
                : [];
            }


            return subpackageData;
          }),
        },
      ],
    };
    this.productservice.addCart(subscribeData).subscribe(
      (response) => {
        if (response.code == 200) {
          this.modal.open(content, { centered: true });

        } else if (response.code == 400) {
          this.error_message = response.message;

        }
      }
    );
  }

}
