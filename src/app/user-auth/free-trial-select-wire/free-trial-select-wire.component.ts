import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ResponseDialogComponent } from 'src/app/module/response-dialog/response-dialog.component';


@Component({
  selector: 'app-free-trial-select-wire',
  templateUrl: './free-trial-select-wire.component.html',
  styleUrls: ['./free-trial-select-wire.component.css']
})
export class FreeTrialSelectWireComponent implements OnInit {
  subscription_type: string = '';
  public responseData: any[] = [];
  public activeData: any[] = [];
  public wireType: string = '';
  ispaid: boolean = false;

  constructor(private productService: ProductService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {

    localStorage.removeItem('package_id');
    localStorage.removeItem('summary_type');
    localStorage.removeItem('selected_data');
    localStorage.removeItem('selected_package');

    this.subscription_type = localStorage.getItem('subscription_type') || '';
    console.log(this.subscription_type);

    this.productService.getCategories().subscribe(
      (data) => {
        this.activeData = data.data;
        console.log('active data');
        console.log(this.activeData);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );


    if (this.subscription_type === 'PAID') {
      this.ispaid = true;
    }
  }



  setWireType() {
    for (const item of this.activeData) {
      if (item.cat_name === 'commodity wire') {
        this.wireType = 'commodityWire';
        break;
      } else if (item.cat_name === 'equity wire') {
        this.wireType = 'equityWire';
        break;
      } else if (item.cat_name === 'money wire') {
        this.wireType = 'moneyWire';
        break;
      }
    }
  }

  redirectToNextPage(item: any, summaryType: string = '') {

    if (summaryType === 'FULL' || summaryType == 'FULL') {
      localStorage.setItem('package_id', item.package_id);
      localStorage.setItem('summary_type', summaryType);
      localStorage.setItem('feed_type', 'LIVE');
      localStorage.setItem('packgae_delay_id', '0');
      this.router.navigate(['free-trial-summary']);
    } else {
      localStorage.setItem('package_id', item.package_id);
      localStorage.setItem('summary_type', summaryType);
      this.router.navigate(['free-trial-product-topic']);
    }
  }


  scheduleCallBack() {
    this.productService.scheduleCallBack().subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 200) {
          this.openDialog(response.message);
        }
      }
    );
  }


  openDialog(responseMessage: string): void {
    const dialogRef = this.dialog.open(ResponseDialogComponent, {
      width: '400px',
      data: { message: responseMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
