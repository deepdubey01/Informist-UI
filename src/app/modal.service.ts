import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './user-auth/signup/signup.component';


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalService: NgbModal) { }

  openModal() {
    const modalRef = this.modalService.open(SignupComponent, {
      centered: true, // Center the modal vertically and horizontally
    });

  }
}
