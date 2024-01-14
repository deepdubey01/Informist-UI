import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/service/shared.service';



@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  isToastVisible: boolean = false;
  private isHovered: boolean = false;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public activeModal: NgbActiveModal,
    public sharedservice: SharedService) { }

  onThemeChange(event: Event) {
    const selectedTheme = (event.target as HTMLSelectElement).value;
    localStorage.setItem('selectedTheme', selectedTheme);
    this.sharedservice.onThemeChange(selectedTheme);

  }

  applyTheme() {
    this.sharedservice.applyTheme();
  }

  closeModal() {
    this.activeModal.close('Modal closed');
  }

  setHoverStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.sharedservice.getButtonHoverColor());
  }

  resetStyles() {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }

  setButtonHoverColor(isHovered: boolean) {
    this.isHovered = isHovered;
  }
}
