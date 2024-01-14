import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';



@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.css']
})
export class AdminChangePasswordComponent {
  otpSent = false;
  showLoginForm = false;
  errorMessage: string = '';
  merrorMessage: string = '';
  oldpassword: string = '';
  newpassword: string = '';
  confirmpassword: string = '';
  showSuccessModal: boolean = false;
  loggedInUser: any = '';
  login_type: any = '';

  UpdateFormData = {
    old_password: '',
    password: '',
    confirm_password: ''
  };

  constructor(
    private productService: AdminApiService,
    private router: Router,
    private adminAuth: AdminAuthService
  ) { }
  ngOnInit(): void {
  }



  submitForm(loginForm: NgForm) {

    const UpdateFormData = {
      old_password: loginForm.value.oldpassword,
      password: loginForm.value.newpassword,
      confirm_password: loginForm.value.confirmpassword,
    };

    console.log(UpdateFormData);

    this.productService.UpdatePassword(UpdateFormData).subscribe(
      (response) => {
        console.log(response);
        if (response.code === 200) {
          this.errorMessage = '';
          this.adminAuth.logout();
          window.location.href = 'admin/admin-login';
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Failed to Login. Please try again later.';
      }
    );

  }
  isAdmin(userRole: string): boolean {
    // Check if the user role is "admin" (you may need to adjust this logic based on your data)
    return userRole === 'admin';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }



  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }
}
