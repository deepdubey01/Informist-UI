import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackbuttonService {
  private localStorageKey = 'previousUrls';
  private previousUrls: string[] = [];

  constructor(private router: Router) {

    const storedUrls = localStorage.getItem(this.localStorageKey);
    if (storedUrls) {
      this.previousUrls = JSON.parse(storedUrls);
    }
  }

  storePreviousUrl(url: string): void {
    // Add the current URL to the list of previous URLs
    this.previousUrls.push(url);
    // Save the updated list in localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.previousUrls));
    console.log(url);
  }

  navigateBack(): void {
    const previousUrl = this.previousUrls.pop();

    localStorage.setItem(this.localStorageKey, JSON.stringify(this.previousUrls));
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    }
  }
}
