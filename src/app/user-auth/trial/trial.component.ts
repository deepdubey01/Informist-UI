import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'table-http-example',
  styleUrls: ['trial.component.css'],
  templateUrl: 'trial.component.html',
})
export class TableHttpExample implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sort', { read: MatSort }) sort!: MatSort;

  // Define your data source and other variables here

  ngAfterViewInit() {
    this.initDataTable();
  }

  initDataTable() {
    $(document).ready(function () {
      $('.table').DataTable({
        // Disable sorting on the last column
        columnDefs: [
          { orderable: false, targets: 5 }
        ],
        language: {
          paginate: {
            first: '<span class="fa fa-step-backward"></span>', // Custom first page button
            previous: '<span class="fa fa-chevron-left"></span>',
            next: '<span class="fa fa-chevron-right"></span>',
            last: '<span class="fa fa-step-forward"></span>' // Custom last page button
          },
          lengthMenu: 'Display <select class="form-control input-sm">' +
            '<option value="10">10</option>' +
            '<option value="20">20</option>' +
            '<option value="30">30</option>' +
            '<option value="40">40</option>' +
            '<option value="50">50</option>' +
            '<option value="-1">All</option>' +
            '</select> results'
        }
      });
    });
  }

  // Add your data retrieval and handling logic here
}
