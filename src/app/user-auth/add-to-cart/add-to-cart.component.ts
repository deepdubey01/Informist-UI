import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { SharedService } from 'src/app/service/shared.service';




@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent {
  user_id: string | null = '';
  error_message: string = '';
  cartData: any;
  showModal: boolean = false;
  cartEmpty: boolean = false;
  isTrial: boolean = false;
  newData: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private modalService: NgbModal,
    public sharedservice: SharedService,
    private auth: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.productService.getCart().subscribe(
      (response) => {
        if (response.error == 1) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        this.cartData = response.data;
        if (this.cartData.length > 0) {
          this.newData = this.cartData[0].subscription_type;

          if (this.newData === 'TRIAL' || this.newData == 'TRIAL') {
            this.isTrial = true;
          }
        } else {
          this.cartEmpty = true;
        }
      },
      (error) => {
        this.error_message = 'Not able to fetch Data';
      }
    );
  }


  deleteCartPackage(packageId: number) {
    this.productService.deleteCartPackage(packageId).subscribe(
      (response) => {
        location.reload;
      }
    );
  }

  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }
  hideSubscribeModal() {
    location.reload();
    this.showModal = false;
    const modal = document.getElementById('freeTrialModal');
    if (modal) {
      modal.classList.add('fade');
      modal.classList.remove('show');
      modal.setAttribute('aria-modal', 'false');
      modal.setAttribute('role', 'document');
      modal.style.display = 'none';
    }
  }


  openVerticallyCentered(content: any) {
    this.productService.subscribePackage().subscribe(
      (response) => {
        console.log('Response:', response);
        if (response && response.code === 200) {
          this.modalService.open(content, { centered: true });
        } else {
          console.error('Subscription failed. Server response:', response);
          this.error_message = "Subscription failed. Please check the data you provided.";
        }
      },
      (error) => {
        console.error('Error:', error);
        this.error_message = "Something went wrong. Please try again later.";
      }
    );
  }

  deleteCart(package_id: number) {
    this.productService.deleteCartPackage(package_id).subscribe(
      (response) => {
        if (response.code == 200) {
          window.location.reload();
        }
      }
    )
  }
}


