import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  mobileNumber: string = '';
  otp: string[] = ['', '', '', '', '', ''];
  showSuccessModal: boolean = false;
  errorMessage: string = '';
  @ViewChild('successModal') successModalRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,

  ) { }

  ngOnInit() {
    this.mobileNumber = this.route.snapshot.queryParamMap.get('mobile_no') || '';
  }
  moveToNextInput(event: Event, currentIndex: number, nextInputId?: string) {
    const inputElement = event.target as HTMLInputElement;
    const digit = inputElement.value;
    if (digit.length > 1) {
      inputElement.value = digit.charAt(0);
    }
    const maxLength = parseInt(inputElement.getAttribute('maxlength') || '1', 10);
    const currentLength = inputElement.value.length;

    if (currentLength === maxLength && nextInputId) {
      const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
      nextInput?.focus();
    }
    this.otp[currentIndex] = inputElement.value;
  }
  verifyOTP() {
    const otpValue = this.otp.join('');
    console.log(this.mobileNumber, otpValue);
    this.productService.verifyOtp(this.mobileNumber, otpValue).subscribe(
      (response) => {
        if (response.code === 200) {
          // const authToken = response.token;
          // this.authService.setToken(authToken);
          console.log('Response:', response);
          this.showSuccessModal = true;
        } else {
          this.errorMessage = 'OTP verification failed. Please check your OTP and try again.';
        }
      },

      (error) => {
        console.log('Error sending OTP', error);
        this.errorMessage = 'OTP verification failed.';
      }
    );
  }

  redirectToProfile() {
    this.router.navigate(['/free-trial-select-wire'], { queryParams: { mobile_number: this.mobileNumber } });
  }

  isAllInputsFilled(): boolean {
    return this.otp.every((digit) => digit !== '');
  }
}
