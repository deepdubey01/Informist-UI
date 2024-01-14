// theme-toggle-button.component.ts
import { Component } from '@angular/core';
import { ThemeService } from 'src/app/service/theme.service';

@Component({
  selector: 'app-theme-toggle-button',
  templateUrl: './theme-toggle-button.component.html',
  styleUrls: ['./theme-toggle-button.component.css'],
})
export class ThemeToggleButtonComponent {
  constructor(public themeService: ThemeService) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
