import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';

interface UserData {
  user_id: number;
  fname: string;
  lname: string;
  email_id: string;
  // Add more properties as needed
}
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent {
  user_id: any = 0;
  userData: any;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }



  ngOnInit() {
    console.log(this.authService.getToken());
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );


  }
}
