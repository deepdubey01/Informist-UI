import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { UsersManageComponent } from './users-manage/users-manage.component';
import { SubscriptionManageComponent } from './subscription-manage/subscription-manage.component';
import { SidebarLayoutComponent } from './sidebar-layout/sidebar-layout.component';
import { DashboardLteComponent } from './dashboard-lte/dashboard-lte.component';
import { PackageManageComponent } from './package-manage/package-manage.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { CategoriesManageComponent } from './categories-manage/categories-manage.component';
import { AddCategoriesComponent } from './add-categories/add-categories.component';
import { AddSubpackageComponent } from './add-subpackage/add-subpackage.component';
import { SubpackageManageComponent } from './subpackage-manage/subpackage-manage.component';
import { DelayManageComponent } from './delay-manage/delay-manage.component';
import { AddDelayComponent } from './add-delay/add-delay.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { ConfirmationDialogComponent } from './mat-design/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SubscriptionPackageDetailsComponent } from './subscription-package-details/subscription-package-details.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { BulkUserComponent } from './bulk-user/bulk-user.component';
import { DataTablesModule } from 'angular-datatables';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { AlertDialogComponent } from './mat-design/alert-dialog/alert-dialog.component';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password.component';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password.component';
import { MenuPreferenceComponent } from './menu-preference/menu-preference.component';



@NgModule({
  declarations: [
    UsersManageComponent,
    SubscriptionManageComponent,
    SidebarLayoutComponent,
    DashboardLteComponent,
    PackageManageComponent,
    AddPackageComponent,
    SubpackageManageComponent,
    CategoriesManageComponent,
    AddCategoriesComponent,
    AddSubpackageComponent,
    DelayManageComponent,
    AddDelayComponent,
    SubscriptionDetailsComponent,
    ConfirmationDialogComponent,
    SubscriptionPackageDetailsComponent,
    AdminLoginComponent,
    BulkUserComponent,
    PaymentListComponent,
    AdminChangePasswordComponent,
    AlertDialogComponent,
    AdminForgotPasswordComponent,
    AdminResetPasswordComponent,
    MenuPreferenceComponent,
  ],
  imports: [
    FormsModule,
    RouterModule,
    DataTablesModule,
    NgSelectModule,
    NgbDropdownModule,
    CommonModule,
    MatDialogModule
  ],
})
export class AdminLteModule { }
