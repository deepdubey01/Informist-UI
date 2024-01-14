import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <div class="modal-body text-center">
  <img src="assets/images/check-mark.png" alt="Checkmark Image" width="80" height="80">
  <p class="text-dark">{{ message }}</p>
</div>
<div class="modal-footer">
  <button class="btn btn-secondary" (click)="onNoClick()">
    <i class="fas fa-times"></i> No
  </button>
  <button class="btn btn-primary" (click)="onYesClick()">
    <i class="fas fa-check"></i> Yes
  </button>
</div>

  `,
})
export class ConfirmationDialogComponent {
  @Input() message: string | undefined;

  constructor(public activeModal: NgbActiveModal) { }

  onNoClick(): void {
    this.activeModal.close(false);
  }

  onYesClick(): void {
    this.activeModal.close(true);
  }
}
