// mobile-number.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileNumberService {
  mobileNumber: string = '';

  constructor() { }
}
