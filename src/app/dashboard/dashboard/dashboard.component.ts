import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements AfterViewInit {
  public responseData: any[] = [];
  public activeData: any[] = [];
  isUserLoggedIn: boolean = true;
  constructor(
    private productService: ProductService,
    private authService: AuthenticationService,
  ) { this.isUserLoggedIn = this.authService.isUserLoggedIn(); }



  ngOnInit() {

    this.productService.getCategories().subscribe(
      (data) => {
        this.responseData = data.data;
        console.log(this.responseData);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  teamMembers = [
    {
      photo: 'assets/images/pankaj-aher.png',
      name: 'Pankaj Aher',
      designation: 'Board of Directors',
      bio: 'Pankaj is the Founder and CEO of Cogencis Information Services Ltd. Director on the Board of Directors of Informist Data & Analytics. A career journalist-turned entrepreneur, Pankaj started his journey CRISIL MarketWire in 2001',
    },
    {
      photo: 'assets/images/k-prakash.png',
      name: 'K Prakash',
      designation: 'Vice President – Data',
      bio: 'Prakash is the Vice President – Data at Informist and is a key part of the data management team. With over two decades of work experience and has earlier worked with companies such as Capital Market Publishers and Tickerplant Infovending.',
    },
    // Add other team members here...
  ];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: false }) carousel?: NgbCarousel;

  ngAfterViewInit() {
    if (this.carousel) {
      this.carousel.wrap = true; // Enable looping through the slides
    }
  }

  togglePaused() {
    if (this.carousel) {
      if (this.paused) {
        this.carousel.cycle();
      } else {
        this.carousel.pause();
      }
      this.paused = !this.paused;
    }
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}
