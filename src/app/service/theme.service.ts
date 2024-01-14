import { Injectable } from '@angular/core';

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themes: Theme[] = [
    {
      name: 'theme1',
      backgroundColor: '#3498db', // Blue
      textColor: '#ffffff', // White
    },
    {
      name: 'theme2',
      backgroundColor: '#e74c3c', // Red
      textColor: '#ffffff', // White
    },
    {
      name: 'theme3',
      backgroundColor: '#2ecc71', // Green
      textColor: '#ffffff', // White
    },
    {
      name: 'theme4',
      backgroundColor: '#f39c12', // Orange
      textColor: '#ffffff', // White
    },
    {
      name: 'theme5',
      backgroundColor: '#9b59b6', // Purple
      textColor: '#ffffff', // White
    },
  ];

  private currentThemeIndex = 0; // Default theme index

  getTheme(): Theme {
    return this.themes[this.currentThemeIndex];
  }

  toggleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
  }
}
