import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/authentication.service';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { AdminAuthService } from 'src/app/service/admin-auth.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  otpSent = false;
  showLoginForm = false;
  userId: string | null = null;
  errorMessage: string = '';
  merrorMessage: string = '';
  mobile_number: string = '';
  email_id: string = '';
  password: string = '';
  mobile_no: any = '';
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
    private productService: AdminApiService,
    private router: Router,
    private adminAuth: AdminAuthService
  ) { }
  ngOnInit(): void {
  }

  submitForm(loginForm: NgForm) {
    if (!this.isValidEmail(loginForm.value.username)) {
      this.errorMessage = 'Invalid email format.';
      return;
    }
    const credentials = {
      email_id: loginForm.value.username,
      password: loginForm.value.password,
    };

    this.adminAuth.adminLogin(credentials).subscribe(
      (response) => {
        if (response.code === 200) {
          const adminToken = response.data.access_token;
          const adminRole = response.data.role;
          this.adminAuth.setAdminToken(adminToken);
          this.adminAuth.setAdminRole(adminRole);
          this.router.navigate(['/admin']);
          this.productService.getadminCategories().subscribe(
            (response) => {
              if (response.data) {
                const jsonData = JSON.stringify(response.data);
                localStorage.setItem('allpackage', jsonData);
              }
            }
          );
        } else if (response.code === 400) {
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
