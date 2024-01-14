import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';

@Component({
  selector: 'app-admin-forgot-password',
  templateUrl: './admin-forgot-password.component.html',
  styleUrls: ['./admin-forgot-password.component.css']
})
export class AdminForgotPasswordComponent {
  errorMessage: any = '';
  successMessage: any = '';
  isSendMail: boolean = false;
  username: any = '';

  constructor(private productService: AdminApiService, private router: Router) { }

  ngOnInit(): void { }

  signUp(loginForm: NgForm) {
    const signUpData = {
      username: loginForm.value.username,
    };

    console.log(this.username);

    if (this.username == '') {
      this.errorMessage = 'Please Enter your Email or Mobile number'
    } else {
      this.productService.adminForgotPassowrd(signUpData).subscribe(
        (response) => {
          if (response.code == 200) {
            this.isSendMail = true;
            this.errorMessage = '';
            this.successMessage = 'Password Reset Request Sent on Mail';
          } else {
            this.errorMessage = response.data;
          }
        }
      );
    }


  }

}
