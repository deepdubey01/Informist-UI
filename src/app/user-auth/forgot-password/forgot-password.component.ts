import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  errorMessage: any = '';
  successMessage: any = '';
  isSendMail: boolean = false;
  username: any = '';

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void { }

  signUp(loginForm: NgForm) {
    const signUpData = {
      username: loginForm.value.username,
    };

    console.log(this.username);

    if (this.username == '') {
      this.errorMessage = 'Please Enter your Email or Mobile number'
    } else {
      this.productService.forgotpassword(signUpData).subscribe(
        (resonse) => {
          if (resonse.code == 200) {
            this.isSendMail = true;
            this.successMessage = 'Password Reset Request Sent on Mail';
          }
        }
      );
    }


  }

}

