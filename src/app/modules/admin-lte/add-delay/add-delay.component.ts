import { Component, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/service/admin-api.service';
import { BackbuttonService } from 'src/app/service/backbutton.service';

@Component({
  selector: 'app-add-delay',
  templateUrl: './add-delay.component.html',
  styleUrls: ['./add-delay.component.css']
})
export class AddDelayComponent {
  no_of_minutes: number = 0;
  delay_name: string = '';
  delayNameOptions: any[] = [];
  error_message: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private back: BackbuttonService,
    private productService: AdminApiService,
  ) { }



  ngOnInit(): void {
    this.productService.getDelay().subscribe(
      (getdelayresponse) => {
        this.delayNameOptions = getdelayresponse.data;

      },
      (error) => {
        this.error_message = "Error";
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.back.storePreviousUrl(this.router.url);
  }

  goBack(): void {
    this.back.navigateBack();
  }


  addPackage(packageData: NgForm) {
    const formValues = packageData.value;
    console.log(formValues);
    this.productService.addDelay(formValues).subscribe(
      (response) => {
        if (response.code == 200) {
          window.location.href = 'admin/delay-manage';
          console.log(response);
        } else if (response.code == 400) {
          this.error_message = response.message;
        }
      },
      (error) => {
        this.error_message = 'Update error';
      }
    );

  }
}
