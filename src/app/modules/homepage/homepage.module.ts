import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderModule } from 'src/app/header/header.module';
import { SettingComponent } from './setting/setting.component';
import { MainsidebarComponent } from './mainsidebar/mainsidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatBadgeModule } from '@angular/material/badge';
import { UserAuthModule } from 'src/app/user-auth/user-auth.module';
import { AngularSplitModule } from 'angular-split';
import { CdkMenu, CdkMenuItem, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { ContextMenuService } from 'src/app/service/context-service.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { NewsLayout1Component } from './news-layout1/news-layout1.component';
import { NewsLayout2Component } from './news-layout2/news-layout2.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    HomepageComponent,
    SettingComponent,
    MainsidebarComponent,
    FilterPanelComponent,
    NewsLayout1Component,
    NewsLayout2Component
  ],


  imports: [
    CommonModule,
    UserAuthModule,
    HeaderModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule
    ,
    FormsModule, NgbModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    OverlayModule,
    MatTabsModule,
    MatIconModule,
    RouterModule,
    NgSelectModule,
    MatBadgeModule,
    AngularSplitModule,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomepageModule { }
