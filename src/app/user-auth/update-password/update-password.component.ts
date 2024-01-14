import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {
  @ViewChild('responseModalMain') responseModalMain: any;
  otpSent = false;
  verificationCode: string = '';
  isVerificationInputVisible: boolean = false;
  errorMessage: string = '';
  closeResult = '';
  validMobileLength: boolean = false;
  responseModal: any = '';
  old_password: any = '';
  password: any = '';
  confirm_password: any = '';

  showSuccessModal: boolean = false;
  login_type: any = '';
  signUpData = {
    old_password: '',
    password: '',
    confirm_password: '',
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthenticationService,
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  openModal(responseModalMain: any) {
    this.modalService.open(responseModalMain, { size: 'lg', centered: true, backdrop: 'static' });
  }


  signUp(signUpForm: NgForm) {
    this.errorMessage = '';
    if (this.old_password === '' || this.password === '' || this.confirm_password === '') {
      this.errorMessage = 'Please fill all details..!!';
    } else {
      const signUpData = {
        old_password: this.old_password,
        password: this.password,
        confirm_password: this.confirm_password,
      };
      this.productService.changePassword(signUpData).subscribe(
        (response) => {
          console.log(signUpData);
          if (response.code == 200) {
            this.modalService.dismissAll();
          } else {
            this.errorMessage = response.message;
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




  mobilenumberOTP(event: any) {
    const inputValue = event.target.value;
    console.log(inputValue.length);
    if (inputValue.length >= 10) {
      this.validMobileLength = true;
    }
  }


  handleVerificationCodeChange() {
    if (this.verificationCode.length === 6) {
      this.submitVerification();
    }
  }


  submitVerification() {
    console.log('Verification code submitted:', this.verificationCode);
  }
  closeModal() {
    this.activeModal.close('Modal closed');
  }
}
