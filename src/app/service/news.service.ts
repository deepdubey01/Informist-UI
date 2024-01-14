
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private newsDataSubject = new BehaviorSubject<any[]>([]);
  newsData$ = this.newsDataSubject.asObservable();

  updateNewsData(newsData: any[]): void {
    this.newsDataSubject.next(newsData);
  }
}
