import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private requestCount = 0;
  private isLoading = new BehaviorSubject<boolean>(false);

  isLoading$ = this.isLoading.asObservable();

  show() {
    this.requestCount++;
    this.isLoading.next(true);
  }

  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.isLoading.next(false);
    }
  }
}
