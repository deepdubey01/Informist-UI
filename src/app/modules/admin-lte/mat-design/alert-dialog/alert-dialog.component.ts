import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-alert-dialog',
  providers: [NgbModalConfig, NgbModal],
  template: `
    <div class="modal-body text-center">
      <img src="assets/images/check-mark.png" alt="Checkmark Image" width="80" height="80">
      <p class="text-dark">{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="closeDialog()">OK</button>
    </div>
  `,
})
export class AlertDialogComponent {
  constructor(public activeModal: NgbActiveModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  @Input() message: string | undefined;

  closeDialog(): void {
    this.activeModal.close();
  }
}
