import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ModalDismissReasons, NgbDatepicker, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ProductService } from '../api.service';
import { untilDestroyed } from '@ngneat/until-destroy';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfirmationDialogComponent } from '../modules/admin-lte/mat-design/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../module/error-dialog/error-dialog.component';
import { SettingComponent } from '../modules/homepage/setting/setting.component';
import { SharedService } from '../service/shared.service';
import { UpdatePasswordComponent } from '../user-auth/update-password/update-password.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() userId: string | null = null;
  isLoginPage: boolean = true;
  showNotificationBadge: boolean = true;
  userData: any;
  isUserLoggedIn: boolean = false;
  isdashboard: boolean = true;
  closeResult = '';
  isRealLoginPage: boolean = true;
  isSubscribePage: boolean = true;
  isHomePage: boolean = true;
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
  errorMessage: string = '';
  old_password: any = '';
  new_password: any = '';
  confirm_password: any = '';
  signUpData = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };
  notificationData: any;
  selectedTheme: string = localStorage.getItem('selectedTheme') || '';
  isToastVisible: boolean = false;
  notification: any;
  notificationCount: any;
  constructor(private router: Router,
    private authService: AuthenticationService,
    private productService: ProductService,
    private dialog: MatDialog,
    public sharedservice: SharedService,
    private observer: BreakpointObserver,
    private renderer: Renderer2,
    private modalService: NgbModal) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.isRealLoginPage = url.endsWith('/login') || url.endsWith('signup');
        this.isLoginPage = url.endsWith('/');
        this.isdashboard = url.endsWith('/');
        this.isHomePage = url.endsWith('/index');
        this.isSubscribePage =
          url.endsWith('/') ||
          url.endsWith('/login') ||
          url.endsWith('forgot-password') ||
          url.endsWith('reset-password');
        this.isUserLoggedIn = this.authService.isUserLoggedIn();
      }
    });
  }


  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      const notificationDataString = localStorage.getItem('notificationData');
      const notificationCountString = localStorage.getItem('notificationCount');

      if (notificationDataString) {
        this.notificationData = JSON.parse(notificationDataString);
      }

      if (notificationCountString) {
        this.notificationCount = parseInt(notificationCountString, 10);
      }
      this.isUserLoggedIn = true;
    }

    this.sharedservice.selectTheme();
  }

  logout() {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: 'md', centered: true
    });
    modalRef.componentInstance.message = 'Do you want to logout..?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });


  }

  open() {
    this.modalService.open(SettingComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  profileOpen(profile: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profile, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  EditProfileOpen(profileEdit: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profileEdit, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  subscriptionOpen(subscription: any) {
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
          this.subscribeResponseData = subscriptionResponse.data.response;
          console.log(this.subscribeResponseData);
          if (this.subscribeResponseData.length == 0) {
            this.cartEmpty = true;
          }
        }
      },
      (error) => {
        console.log(error);
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
    this.modalService.open(subscription, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl', }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  changePasswordOpen() {
    this.modalService.open(UpdatePasswordComponent, { ariaLabelledBy: 'modal-basic-title', scrollable: false, size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }


  onSaveChanges(form: NgForm) {
    if (form.valid) {
      const formData = {
        user_id: this.user_id,
        mobile_no: form.value['mobile-number'] || 0,
        email_id: form.value.email || 'string',
        status: 'ACTIVE',
        fname: form.value.fname || 'string',
        lname: form.value.lname || 'string',
        city: form.value.city || 'string',
        country_id: form.value['country_id'] || 0
      };

      console.log(formData);
      this.productService.updateProfile(formData).subscribe(
        (response) => {
          if (response.code === 200) {
            window.location.reload();
          }
        }
      );
    }
  }

  hideNotificationBadge() {
    this.showNotificationBadge = false;
  }
  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }

  signUp(signUpForm: NgForm) {
    this.errorMessage = '';
    if (signUpForm.value.mobile_no == '' && signUpForm.value.email_id == '' && signUpForm.value.password == '') {
      this.errorMessage = 'Please fill all details..!!';
    }
  }


}