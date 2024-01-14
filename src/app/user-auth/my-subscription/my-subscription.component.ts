import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service'
import { AuthenticationService } from 'src/app/authentication.service';
import { ErrorDialogComponent } from 'src/app/module/error-dialog/error-dialog.component';


interface Subtopic {
  subtopic_id: number;
  subtopic_name: string;
  status: string;
  fk_topic_id: number;
  amount: number;
  subtopics: Subtopic[]; // This should be an array of subtopics
}

interface Topic {
  topic_id: number;
  topic_name: string;
  cat_id: number;
  cat_name: string;
  subtopics: Subtopic[];
}

interface ResponseData {
  topics: Topic[];
}

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.css'],
})
export class MySubscriptionComponent implements OnInit {
  user_id: string = '';
  responseData: any[] = [];
  subscribeResponseData: any[] = [];
  subscribepaidResponseData: any[] = [];
  subscribetrialResponseData: any[] = [];
  trialsubscription_until: string = '';
  trialtotal_amt: number = 0;
  trialsubscription_type: string = '';
  paidsubscription_until: string = 'dd/mm/yyyy';
  paidtotal_amt: number = 0;
  paidsubscription_type: string = 'Paid';
  subscriptionData: any;
  subscriptionError: string = '';
  cartEmpty: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthenticationService,
    public dialog: MatDialog
  ) { }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (add 1 as it's zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }



  ngOnInit(): void {

    if (this.authService.isUserLoggedIn()) {
      const userId = this.authService.getUserId();
      if (userId) {
        this.user_id = userId;
      }
    } else {
      window.location.href = 'login';
    }

    this.productService.subscriptionList().subscribe(
      (subscriptionResponse) => {
        console.log(subscriptionResponse);
        if (subscriptionResponse.error === 1) {
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '500px',
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          });
        }

        if (subscriptionResponse.code === 200) {
          this.subscribeResponseData = subscriptionResponse.data;
          console.log(this.subscribeResponseData);
          if (this.subscribeResponseData.length == 0) {
            this.cartEmpty = true;
          }
        } else {
          this.handleSubscriptionError();
        }
      },
      (error) => {
        this.handleSubscriptionError();
      }
    );

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

  }


  private redirectToTrialSelection(): void {
    window.location.href = "/free-trial-select-wire";
  }

  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }


  handleSubscriptionError() {
    // Implement error handling logic
  }
}
