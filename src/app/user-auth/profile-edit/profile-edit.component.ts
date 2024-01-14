import { Component } from '@angular/core';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent {
  user_id: any;
  userData: any = {};
  constructor(
    private productService: ProductService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.user_id = this.authService.getUserId();
    this.productService.userProfile().subscribe(
      (response) => {
        this.userData = response.data;
      }
    );
  }

  onSaveChanges(form: NgForm) {
    if (form.valid) {
      const formData = {
        user_id: this.user_id,
        mobile_no: form.value['mobile-number'] || 0,
        email_id: form.value.email || 'string',
        status: 'ACTIVE',
        fname: form.value.fname || 'string',
        lname: form.value.lname || 'string',
        city: form.value.city || 'string',
        country_id: form.value['country_id'] || 0
      };

      console.log(formData);
      this.productService.updateProfile(formData).subscribe(
        (response) => {
          if (response.code === 200) {
            window.location.reload();
          }
        }
      );
    }
  }

}