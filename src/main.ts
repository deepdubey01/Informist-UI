/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { VERSION as CDK_VERSION } from '@angular/cdk';





platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));





