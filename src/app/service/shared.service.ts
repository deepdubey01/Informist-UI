import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isToastVisible: boolean = false;
  primarybgcolor: string = 'var(--primary-bg-color-default)';
  primarytextcolor: string = 'var(--primary-text-color-default)';
  primarysidetextcolor: string = 'var(--primary-side-color-default)';
  primarybuttoncolor: string = 'var(--primary-button-color-default)';
  PrimaryLogo: any = 'assets/images/informist-text-logo.svg';
  sideLogo: any = 'assets/images/informist-text-logo.svg';
  primaryNavBgColorHover: string = 'var(--primary-nav-bg-color-hover)';
  selectedTheme: string = localStorage.getItem('selectedTheme') || '';
  primarynaviconcolor: string = 'var(--primary-nav-icon-color-default)';
  primarybuttoncolorHoverLight: string = 'var(--primary-button-color-hover-light)';
  primarybuttoncolorHoverDark: string = 'var(--primary-button-color-hover-dark)';
  primarybuttontextcolor: string = '--primary-text-color-light';
  primarypagecolor: string = '--primary-bg-page-color-default';


  constructor() { }

  onThemeChange(selectedTheme: string) {
    this.selectedTheme = selectedTheme;
  }

  applyTheme() {
    localStorage.setItem('selectedTheme', this.selectedTheme);
    this.selectTheme();
    this.isToastVisible = true;
    setTimeout(() => {
      this.isToastVisible = false;
    }, 2000);
  }

  selectTheme() {
    if (this.selectedTheme === 'Light') {
      this.primarybgcolor = 'var(--primary-bg-color-light)';
      this.primarytextcolor = 'var(--primary-text-color-dark)';
      this.primarysidetextcolor = 'var(--primary-side-color-dark)';
      this.primarybuttoncolor = 'var(--primary-button-color-light)';
      this.primarybuttontextcolor = 'var(--primary-text-color-light)';
      this.primarypagecolor = 'var(--primary-bg-page-color-light)';
      this.primarynaviconcolor = 'var(--primary-nav-icon-color-light)';
      this.PrimaryLogo = 'assets/images/Informist final logo.png';

      document.documentElement.style.setProperty('--scrollbar-background', '#fff');
      document.documentElement.style.setProperty('--scrollbar-thumb-background', '#8a8989');
      document.documentElement.style.setProperty('--scrollbar-thumb-border', '2px solid #fff');

      this.primaryNavBgColorHover = 'var(--primary-nav-bg-color-hover-light)';
    } else if (this.selectedTheme === 'Dark') {
      this.primarybgcolor = 'var(--primary-bg-color-dark)';
      this.primarytextcolor = 'var(--primary-text-color-light)';
      this.primarysidetextcolor = 'var(--primary-side-color-dark)';
      this.primarybuttoncolor = 'var(--primary-button-color-dark)';
      this.primarybuttontextcolor = 'var(--primary-text-color-light)';
      this.primarypagecolor = 'var(--primary-bg-page-color-dark)';
      this.PrimaryLogo = 'assets/images/informist-text-logo.svg';
      this.primarynaviconcolor = 'var(--primary-nav-icon-color-dark)';

      document.documentElement.style.setProperty('--scrollbar-background', '#5f5f5f');
      document.documentElement.style.setProperty('--scrollbar-thumb-background', '#575757');
      document.documentElement.style.setProperty('--scrollbar-thumb-border', '2px solid #444');
      this.primaryNavBgColorHover = 'var(--primary-nav-bg-color-hover-dark)';
    }
    else if (this.selectedTheme === 'Lightblue') {
      this.primarybgcolor = 'var(--primary-bg-color-lightblue)';
      this.primarytextcolor = 'var(--primary-text-color-lightblue)';
      this.primarysidetextcolor = 'var(--primary-side-color-lightblue)';
      this.primarybuttoncolor = 'var(--primary-button-color-lightblue)';
      this.primarybuttontextcolor = 'var(--primary-text-color-light)';
      this.PrimaryLogo = 'assets/images/informist-text-logo.svg';
      this.primarypagecolor = 'var(--primary-bg-page-color-lightblue)';
      this.primarynaviconcolor = 'var(--primary-nav-icon-color-lightblue)';
      document.documentElement.style.setProperty('--scrollbar-background', '#5f5f5f');
      document.documentElement.style.setProperty('--scrollbar-thumb-background', '#a9abfe');
      document.documentElement.style.setProperty('--scrollbar-thumb-border', '2px solid #444');
      this.primaryNavBgColorHover = 'var(--primary-nav-bg-color-hover-lightblue)';
    }
    else {
      this.primarybgcolor = 'var(--primary-bg-color-default)';
      this.primarytextcolor = 'var(--primary-text-color-default)';
      this.primarysidetextcolor = 'var(--primary-side-color-default)';
      this.primarybuttoncolor = 'var(--primary-button-color-default)';
      this.primarybuttontextcolor = 'var(--primary-text-color-light)';
      this.PrimaryLogo = 'assets/images/informist-text-logo.svg';
      this.primarypagecolor = 'var(--primary-bg-page-color-default)';
      this.primarynaviconcolor = 'var(--primary-nav-icon-color-default)';
      document.documentElement.style.setProperty('--scrollbar-background', '#5f5f5f');
      document.documentElement.style.setProperty('--scrollbar-thumb-background', '#a9abfe');
      document.documentElement.style.setProperty('--scrollbar-thumb-border', '2px solid #444');


      this.primaryNavBgColorHover = 'var(--primary-nav-bg-color-hover-default)';
    }
  }

  getButtonHoverColor() {
    if (this.selectedTheme === 'Light') {
      return this.primarybuttoncolorHoverLight;
    } else if (this.selectedTheme === 'Dark') {
      return this.primarybuttoncolorHoverDark;
    } else {
      return 'var(--primary-button-color-hover-default)';
    }
  }


}
