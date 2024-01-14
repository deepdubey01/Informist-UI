import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/api.service';


@Component({
  selector: 'app-subscription-info',
  templateUrl: './subscription-info.component.html',
  styleUrls: ['./subscription-info.component.css']
})
export class SubscriptionInfoComponent implements OnInit {
  subscriptionData: any;
  subscriptionError: string = '';

  constructor(private http: HttpClient, private productService: ProductService) { }

  ngOnInit() {
    this.http.get('http://172.17.81.34:8080/api/subscription/?user_id=34')
      .subscribe(
        (data: any) => {
          this.subscriptionData = data.data.trial[0];
        },
        error => {
          console.error('Error fetching data:', error);
          this.subscriptionError = 'An error occurred while fetching data.';
        }
      );
  }
}
