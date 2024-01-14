import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';


@Component({
  selector: 'app-logout-confirm',
  template: `
  <h1 mat-dialog-title class="dialog-title">Confirmation</h1>
  <div mat-dialog-content class="dialog-content">{{ data.message }}</div>
  <div mat-dialog-actions class="dialog-actions">
    <button mat-button class="no-button" [mat-dialog-close]="false">No</button>
    <button mat-button class="yes-button" [mat-dialog-close]="true">Yes</button>
  </div>  
  `,
  templateUrl: './logout-confirm.component.html',
  styleUrls: ['./logout-confirm.component.css']
})
export class LogoutConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
