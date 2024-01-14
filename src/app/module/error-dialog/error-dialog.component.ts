import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>, private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close(false);
      this.auth.logout();
      this.router.navigate(['/login']);
    }, 15000);
  }


  onCloseClick(): void {
    this.dialogRef.close(true);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
