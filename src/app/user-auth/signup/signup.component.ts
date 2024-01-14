import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class SignupComponent {
  @ViewChild('responseModalMain') responseModalMain: any;
  otpSent = false;
  verificationCode: string = '';
  isVerificationInputVisible: boolean = false;
  showLoginForm = false;
  errorMessage: string = '';
  merrorMessage: string = '';
  mobile_number: string = '';
  yourotpSent: any;
  closeResult = '';
  validMobileLength: boolean = false;
  responseModal: any = '';
  email_id: string = '';
  fname: string = '';
  lname: string = '';
  verified: boolean = false;
  showSuccessModal: boolean = false;
  password: string = '';
  cpassword: string = '';
  mobile_no: string = '';
  username: any = '';
  login_type: any = '';

  signUpData = {
    fname: '',
    lname: '',
    mobile_no: '',
    email_id: '',
    password: ''
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthenticationService,
    config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      window.location.href = 'index';
    }
  }

  openModal(responseModalMain: any) {
    this.modalService.open(responseModalMain, { size: 'lg', centered: true, backdrop: 'static' });
  }



  signUp(signUpForm: NgForm) {
    this.errorMessage = '';

    if (!this.verified) {
      this.errorMessage = 'Please verify your phone number before proceeding.';
      return;
    }


    if (signUpForm.value.mobile_no == '' && signUpForm.value.email_id == '' && signUpForm.value.password == '') {
      this.errorMessage = 'Please fill all details..!!';
    } else if (signUpForm.value.mobile_no == '') {
      this.errorMessage = 'Please Enter Your Mobile Number..!!';
    } else if (signUpForm.value.email_id == '') {
      this.errorMessage = 'Please Enter( Your Email Id..!!';
    } else if (signUpForm.value.verificationCode.length < 6) {
      this.errorMessage = 'OTP Must be 6 Digit..!!';
    } else if (signUpForm.value.password === '') {
      this.errorMessage = 'Please Enter Your Password..!!';
    } else if (signUpForm.value.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
    } else if (!/\d/.test(signUpForm.value.password)) {
      this.errorMessage = 'Password must include at least 1 numerical digit.';
    } else if (!/[!@#$%^&*()_+\[\]{};':"\\|,.<>?/=-]/.test(signUpForm.value.password)) {
      this.errorMessage = 'Password must contain at least 1 special character (e.g., !, @, #, $, etc.).';
    } else if (!/[A-Z]/.test(signUpForm.value.password)) {
      this.errorMessage = 'Password must include at least 1 uppercase letter.';
    } else if (signUpForm.value.password != signUpForm.value.cpassword) {
      this.errorMessage = 'Password does not Match..!!';
    }
    else {
      const mobileNumberPattern = /^[9876]\d{9}$/;
      if (!mobileNumberPattern.test(this.mobile_no)) {
        this.errorMessage = 'Invalid Mobile Number..!!';
      }
      const signUpData = {
        fname: signUpForm.value.fname,
        lname: signUpForm.value.lname,
        mobile_no: signUpForm.value.mobile_no,
        email_id: signUpForm.value.email_id,
        password: signUpForm.value.password
      };
      this.productService.verifyOtp_WAT(this.mobile_no, signUpForm.value.verificationCode).subscribe(
        (response) => {
          if (response.code === 200) {
            this.verified = true;
            this.productService.signUp(signUpData).subscribe(
              (response) => {
                console.log(response);
                if (response.code === 200) {
                  this.openModal(this.responseModalMain);
                } else if (response.code === 400) {
                  this.errorMessage = response.message;
                }
              },
              (error) => {
                console.error('SignUp failed:', error);
                this.errorMessage = 'Failed to update profile. Please try again later.';
              }
            );
          }
        }
      );
    }

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


  goToLogin() {
    window.location.href = 'login';
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }


  mobilenumberOTP(event: any) {
    const inputValue = event.target.value;
    console.log(inputValue.length);
    if (inputValue.length >= 10) {
      this.validMobileLength = true;
    }
  }


  showVerificationInput() {
    const loginData = {
      username: this.mobile_no,
      login_type: "OTP"
    };

    this.verified = true;

    this.productService.requestOTP(loginData).subscribe(
      (response) => {
        if (response.code === 400) {
          this.errorMessage = response.message;
        }
      }
    );
    this.isVerificationInputVisible = true;
  }

  handleVerificationCodeChange() {
    if (this.verificationCode.length === 6) {
      this.submitVerification();
    }
  }


  submitVerification() {
    console.log('Verification code submitted:', this.verificationCode);
  }
}
