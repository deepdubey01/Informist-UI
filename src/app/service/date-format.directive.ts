import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    const dateValue = input.value;

    if (dateValue) {
      const parts = dateValue.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        if (year.length === 4 && month.length === 2 && day.length === 2) {
          input.value = `${year}-${month}-${day}`;
        }
      }
    }
  }
}
