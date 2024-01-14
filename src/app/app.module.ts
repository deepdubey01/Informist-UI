import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DashboardModule } from './dashboard/dashboard.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './api.service';
import { UserAuthModule } from './user-auth/user-auth.module';
import { AuthenticationService } from './authentication.service';
import { AdminLteModule } from './modules/admin-lte/admin-lte.module';
import { BrowserModule } from '@angular/platform-browser';
import { HomepageModule } from './modules/homepage/homepage.module';
import { TextTransformService } from './text-transform.service';
import { ToastService } from './toast.service';
import { BackbuttonService } from './service/backbutton.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { LoaderComponent } from './module/loader/loader.component';
import { LoaderInterceptor } from './loader.interceptor';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminAuthService } from './service/admin-auth.service';
import { ErrorDialogComponent } from './module/error-dialog/error-dialog.component';
import { ErrorInterceptor } from './service/error.interceptor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeToggleButtonComponent } from './module/theme-toggle-button/theme-toggle-button.component';
import { ThemeService } from './service/theme.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { HeaderModule } from './header/header.module';
import { LogoutConfirmComponent } from './module/logout-confirm/logout-confirm.component';
import { ResponseDialogComponent } from './module/response-dialog/response-dialog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateFormatDirective } from './service/date-format.directive';
import { AngularSplitModule } from 'angular-split';
import { ContextMenuComponent } from './module/context-menu/context-menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ErrorDialogComponent,
    ThemeToggleButtonComponent,
    LogoutConfirmComponent,
    ResponseDialogComponent,
    DateFormatDirective,
    ContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatIconModule,
    MatBadgeModule,
    NgxPaginationModule, FormsModule,
    AdminLteModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonModule,
    BrowserAnimationsModule,
    HomepageModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    NgbModule,
    HeaderModule,
    UserAuthModule,
    DashboardModule,
    MatSlideToggleModule,
    MatDialogModule,
    AngularSplitModule,
  ],

  providers: [
    ProductService,
    ThemeService,
    AdminAuthService,
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    BackbuttonService,
    TextTransformService],

  bootstrap: [AppComponent],

})
export class AppModule { }
