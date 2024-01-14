import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-free-trial-commodity-wire',
  templateUrl: './free-trial-commodity-wire.component.html',
  styleUrls: ['./free-trial-commodity-wire.component.css']
})
export class FreeTrialCommodityWireComponent implements OnInit {

  ngOnInit() {
    const sublistHeaders = document.querySelectorAll('.list-title');

    sublistHeaders.forEach((header) => {
      const sublist = header.nextElementSibling as HTMLElement;
      const arrow = header.querySelector('.arrow') as HTMLElement | null;

      header.addEventListener('click', () => {
        sublist.style.display = sublist.style.display === 'block' ? 'none' : 'block';
        header.parentElement?.classList.toggle('active');

        if (arrow) {
          arrow.classList.toggle('rotate');
        }
      });

      const customCheckbox = header.querySelector('.custom-checkbox input[type="checkbox"]') as HTMLInputElement;
      const allCheckboxes = sublist.querySelectorAll('input[type="checkbox"]');

      customCheckbox.addEventListener('change', () => {
        allCheckboxes.forEach((checkbox) => {
          (checkbox as HTMLInputElement).checked = customCheckbox.checked;
        });
      });
    });
  }

}
