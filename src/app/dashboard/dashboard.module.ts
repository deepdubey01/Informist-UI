import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderModule } from '../header/header.module';




@NgModule({
  declarations: [
    DashboardComponent

  ],
  imports: [
    CommonModule,
    HeaderModule,
    NgbCarouselModule,
  ]
})
export class DashboardModule { }
