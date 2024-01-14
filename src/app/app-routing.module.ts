import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment, UrlMatchResult, UrlMatcher, Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './user-auth/login/login.component';
import { OtpComponent } from './user-auth/otp/otp.component';
import { FreeTrialSelectWireComponent } from './user-auth/free-trial-select-wire/free-trial-select-wire.component';
import { ProfileComponent } from './user-auth/profile/profile.component';
import { CommunicationComponent } from './user-auth/communication/communication.component';
import { FreeTrialCommodityWireComponent } from './user-auth/free-trial-commodity-wire/free-trial-commodity-wire.component';
import { FreeTrialSummaryComponent } from './user-auth/free-trial-summary/free-trial-summary.component';
import { SelectFreeProductTopicComponent } from './user-auth/select-free-product-topic/select-free-product-topic.component';
import { SignupComponent } from './user-auth/signup/signup.component';
import { ForgotPasswordComponent } from './user-auth/forgot-password/forgot-password.component';
import { MySubscriptionComponent } from './user-auth/my-subscription/my-subscription.component';
import { SubscriptionInfoComponent } from './user-auth/subscription-info/subscription-info.component';
import { UsersManageComponent } from './modules/admin-lte/users-manage/users-manage.component';
import { DashboardLteComponent } from './modules/admin-lte/dashboard-lte/dashboard-lte.component';
import { PackageManageComponent } from './modules/admin-lte/package-manage/package-manage.component';
import { AddPackageComponent } from './modules/admin-lte/add-package/add-package.component';
import { CategoriesManageComponent } from './modules/admin-lte/categories-manage/categories-manage.component';
import { AddCategoriesComponent } from './modules/admin-lte/add-categories/add-categories.component';
import { AddSubpackageComponent } from './modules/admin-lte/add-subpackage/add-subpackage.component';
import { SubpackageManageComponent } from './modules/admin-lte/subpackage-manage/subpackage-manage.component';
import { AddToCartComponent } from './user-auth/add-to-cart/add-to-cart.component';
import { ProfileViewComponent } from './user-auth/profile-view/profile-view.component';
import { HomepageComponent } from './modules/homepage/homepage/homepage.component';
import { SettingComponent } from './modules/homepage/setting/setting.component';
import { DelayManageComponent } from './modules/admin-lte/delay-manage/delay-manage.component';
import { LoaderComponent } from './module/loader/loader.component';
import { AddDelayComponent } from './modules/admin-lte/add-delay/add-delay.component';
import { ProfileEditComponent } from './user-auth/profile-edit/profile-edit.component';
import { SubscriptionManageComponent } from './modules/admin-lte/subscription-manage/subscription-manage.component';
import { SubscriptionDetailsComponent } from './modules/admin-lte/subscription-details/subscription-details.component';
import { AdminLoginComponent } from './modules/admin-lte/admin-login/admin-login.component';
import { authGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { BulkUserComponent } from './modules/admin-lte/bulk-user/bulk-user.component';
import { ResetPasswordComponent } from './user-auth/reset-password/reset-password.component';
import { AdminChangePasswordComponent } from './modules/admin-lte/admin-change-password/admin-change-password.component';
import { SubscriptionPackageDetailsComponent } from './modules/admin-lte/subscription-package-details/subscription-package-details.component';
import { PaymentListComponent } from './modules/admin-lte/payment-list/payment-list.component';
import { UpdatePasswordComponent } from './user-auth/update-password/update-password.component';
import { AdminForgotPasswordComponent } from './modules/admin-lte/admin-forgot-password/admin-forgot-password.component';
import { AdminResetPasswordComponent } from './modules/admin-lte/admin-reset-password/admin-reset-password.component';
import { TableHttpExample } from './user-auth/trial/trial.component';
import { FilterPanelComponent } from './modules/homepage/filter-panel/filter-panel.component';
import { NewsLayout1Component } from './modules/homepage/news-layout1/news-layout1.component';
import { MenuPreferenceComponent } from './modules/admin-lte/menu-preference/menu-preference.component';


const adminRouteData = { roles: ['ADMIN'] };
const accountsRouteData = { roles: ['ACCOUNTS'] };


function customUrlMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length >= 2 && segments[0].path === 'reset-password') {
    const paramValue = segments.slice(1).map(segment => segment.path).join('/');
    const posParams = { paramValue: new UrlSegment(paramValue, {}) };
    return { consumed: segments, posParams };
  }

  return null;
}




const routes: Routes = [
  { path: 'filter', component: FilterPanelComponent },
  { path: 'trial', component: TableHttpExample },
  { path: 'index', component: HomepageComponent },
  { path: '', component: HomepageComponent },
  // { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'free-trial-select-wire', component: FreeTrialSelectWireComponent, canActivate: [authGuard] },
  { path: 'communication', component: CommunicationComponent, canActivate: [authGuard] },
  { path: 'layout1', component: NewsLayout1Component, canActivate: [authGuard] },
  { path: 'free-trial-commodity-wire', component: FreeTrialCommodityWireComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'free-trial-summary', component: FreeTrialSummaryComponent, canActivate: [authGuard] },
  { path: 'free-trial-product-topic', component: SelectFreeProductTopicComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'update-password', component: UpdatePasswordComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'my-subscription', component: MySubscriptionComponent, canActivate: [authGuard] },
  { path: 'subscribe-info', component: SubscriptionInfoComponent, canActivate: [authGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [authGuard] },
  { path: 'add-to-cart', component: AddToCartComponent, canActivate: [authGuard] },
  { path: 'view-profile', component: ProfileViewComponent, canActivate: [authGuard] },
  { path: 'edit-profile', component: ProfileEditComponent, canActivate: [authGuard] },

  {
    matcher: customUrlMatcher,
    component: ResetPasswordComponent,
    pathMatch: 'full'
  },

  { path: 'admin/admin-login', component: AdminLoginComponent },
  { path: 'admin/admin-forgot-password', component: AdminForgotPasswordComponent },
  { path: 'admin/admin-reset-password', component: AdminResetPasswordComponent },

  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'subscription-manage', component: SubscriptionManageComponent, canActivate: [AdminGuard] },
      { path: 'subscription-details', component: SubscriptionDetailsComponent, canActivate: [AdminGuard] },
      { path: 'admin-login', component: AdminLoginComponent },
      { path: 'user-manage', component: UsersManageComponent, canActivate: [AdminGuard] },
      { path: 'dashboard-lte', component: DashboardLteComponent, canActivate: [AdminGuard] },
      { path: 'package-manage', component: PackageManageComponent, canActivate: [AdminGuard] },
      { path: 'admin-change-password', component: AdminChangePasswordComponent, canActivate: [AdminGuard] },
      { path: 'add-package', component: AddPackageComponent, canActivate: [AdminGuard] },
      { path: 'add-delay', component: AddDelayComponent, canActivate: [AdminGuard] },
      { path: 'add-categories', component: AddCategoriesComponent, canActivate: [AdminGuard] },
      { path: 'subpackage-manage', component: SubpackageManageComponent, canActivate: [AdminGuard] },
      { path: 'delay-manage', component: DelayManageComponent, canActivate: [AdminGuard] },
      { path: 'categories-manage', component: CategoriesManageComponent, canActivate: [AdminGuard] },
      { path: 'add-subpackage', component: AddSubpackageComponent, canActivate: [AdminGuard] },
      { path: 'add-menu', component: MenuPreferenceComponent, canActivate: [AdminGuard] },
      { path: 'bulk-user', component: BulkUserComponent, canActivate: [AdminGuard] },
      { path: 'abc', component: SubscriptionPackageDetailsComponent, canActivate: [AdminGuard] },
      { path: 'payment-list', component: PaymentListComponent, canActivate: [AdminGuard] },
      { path: 'admin-forgot-password', component: AdminForgotPasswordComponent },
      { path: 'admin-reset-password', component: AdminResetPasswordComponent },

      { path: '', redirectTo: 'user-manage', pathMatch: 'full' },
      { path: '**', redirectTo: 'user-manage' }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
