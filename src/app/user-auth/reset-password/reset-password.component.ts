import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  successMessage: string = '';
  errorMessage: string = '';
  confirm_password: string = '';
  password: string = '';
  paramValue: string = '';
  timeout: any = '';
  showPassword: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('paramValue');
      if (paramValue !== null) {
        this.paramValue = paramValue;
        console.log('Parameter value:', this.paramValue);
      }
    });
  }

  signUp(loginForm: NgForm) {
    const resetData = {
      encoded_text: this.paramValue,
      password: loginForm.value.password,
      confirm_password: loginForm.value.password,
    };

    this.errorMessage = '';

    if (loginForm.value.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
    } else if (!/\d/.test(this.password)) {
      this.errorMessage = 'Password must include at least 1 numerical digit.';
    } else if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>?/=-]/.test(this.password)) {
      this.errorMessage = 'Password must contain at least 1 special character (e.g., !, @, #, $, etc.).';
    } else if (this.password !== this.confirm_password) {
      this.errorMessage = 'Passwords do not match.';
    } else {
      this.productService.resetpassword(resetData).subscribe(
        (response) => {
          console.log(response);
          if (response.code == 200) {
            this.router.navigate(['/login']);
          }
        }
      );
    }
  }

  startTimeout() {
    this.timeout = setTimeout(() => {
      this.showPassword = true;
    }, 100);
  }

  clearTimeout() {
    clearTimeout(this.timeout);
    this.showPassword = false;
  }
}
