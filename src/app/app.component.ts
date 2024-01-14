import { Component } from '@angular/core';
import { ProductService } from './api.service';

declare function ConnectToServer(): any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'informist';

  // ConnectToServer();

}
