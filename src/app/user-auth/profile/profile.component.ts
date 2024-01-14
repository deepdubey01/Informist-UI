import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  mobileNumber: string = '';
  selectedCountry: string | null = '1'; // Default selection set to "India"
  isCountrySelected: boolean = true; // Always true since "India" is selected
  errorMessage: string = '';

  profileData = {
    name: '',
    email: '',
    city: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

  ngOnInit() {
    this.mobileNumber = this.route.snapshot.queryParamMap.get('mobile_number') || '';
  }

  updateProfile(profileForm: NgForm) {
    if (profileForm.valid) {
      console.log(profileForm.value.name);
      const profileData = {
        mobile_no: this.mobileNumber,
        email_id: profileForm.value.email,
        fname: profileForm.value.name,
        lname: '',
        city: profileForm.value.city,
        country_id: this.selectedCountry
      };

      this.productService.updateProfile(profileData).subscribe(
        (response) => {
          console.log('Profile update successful:', response);
          if (response.code == 200) {
            alert('Profile update successful!');
            this.router.navigate(['/communication']);
          } else if (response.code == 400) {
            this.errorMessage = 'Email Already Exist';
          }
        },
        (error) => {
          console.error('Profile update failed:', error);
          // Handle the error if needed
          this.errorMessage = 'Failed to update profile. Please try again later.';
        }
      );
    }
  }

  setCountryValidity(countrySelect: NgModel) {
    this.isCountrySelected = !countrySelect.invalid;
  }

  isFormValid(form: NgForm): boolean {
    return form?.valid ?? false;
  }
}
