import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HeaderModule } from '../header/header.module';
import { OtpComponent } from './otp/otp.component';
import { FreeTrialSelectWireComponent } from './free-trial-select-wire/free-trial-select-wire.component';
import { ProfileComponent } from './profile/profile.component';
import { CommunicationComponent } from './communication/communication.component';
import { FreeTrialSummaryComponent } from './free-trial-summary/free-trial-summary.component';
import { FreeTrialCommodityWireComponent } from './free-trial-commodity-wire/free-trial-commodity-wire.component';
import { SelectFreeProductTopicComponent } from './select-free-product-topic/select-free-product-topic.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MySubscriptionComponent } from './my-subscription/my-subscription.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SubtopicItemComponent } from './subtopic-item/subtopic-item.component';
import { SubscriptionInfoComponent } from './subscription-info/subscription-info.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    LoginComponent,
    SubtopicItemComponent,
    OtpComponent,
    FreeTrialSelectWireComponent,
    ProfileComponent,
    CommunicationComponent,
    FreeTrialSummaryComponent,
    FreeTrialCommodityWireComponent,
    SelectFreeProductTopicComponent,
    SignupComponent,
    ForgotPasswordComponent,
    MySubscriptionComponent,
    ResetPasswordComponent,
    SubscriptionInfoComponent,
    AddToCartComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    MatSortModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    HeaderModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'otp', component: OtpComponent },
    ]),
  ],
  exports: [UpdatePasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAuthModule { }
