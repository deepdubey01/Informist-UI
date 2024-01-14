import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  otpSent = false;
  showLoginForm = false;
  userId: string | null = null;
  errorMessage: string = '';
  merrorMessage: string = '';
  mobile_number: string = '';
  email_id: string = '';
  password: string = '';
  mobile_no: any = '';
  loginInProgress: boolean = false;
  rememberMe: any = '';
  username: any = '';
  showSuccessModal: boolean = false;
  loggedInUser: any = '';
  login_type: any = '';

  signUpData = {
    mobile_no: '',
    email_id: '',
    password: ''
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthenticationService
  ) { }
  ngOnInit(): void {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedUsername && rememberedPassword) {
      this.username = rememberedUsername;
      this.password = rememberedPassword;
      this.rememberMe = true;
    }
    if (this.authService.isUserLoggedIn()) {
      this.checkSubscriptionAndShowModal();
    } 
  }

  sentOTP(loginForm: NgForm, rememberMeChecked: boolean) {
    const credentials = {
      username: loginForm.value.username,
      password: loginForm.value.password,
      login_type: "PASSWORD"
    };
    if (rememberMeChecked == true) {
      console.log(loginForm.value.username);
      localStorage.setItem('rememberedUsername', loginForm.value.username);
      localStorage.setItem('rememberedPassword', loginForm.value.password);
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
    }

    this.loginInProgress = true;
    const attemptLogin = () => {
      this.authService.login(credentials).subscribe(
        (response) => {
          if (response.code === 200) {
            window.location.href = 'index';
          } else if (response.code === 400) {
            this.loginInProgress = false;
            this.errorMessage = response.message;
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Failed to Login. Please try again later.';
          setTimeout(attemptLogin, 2000);
        }
      );
    };

    attemptLogin();
  }


  checkSubscriptionAndShowModal() {
    window.location.href = 'index';
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }
}
