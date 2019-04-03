import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypedFormExampleComponent } from './components/typed-form-example/typed-form-example.component';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art/angular-globalize';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'globalize/currency';
import 'globalize/date';
import 'globalize/number';
import { loadGlobalizeData } from 'projects/ng-form-helpers/test/globalize-data-loader';
import { NgFormHelpersModule, NgFormHelpersBootstrap4Module } from '@code-art/ng-form-helpers';

@NgModule({
  declarations: [
    AppComponent,
    TypedFormExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularGlobalizeModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgFormHelpersModule,
    NgFormHelpersBootstrap4Module,
  ],
  providers: [{
      provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG']
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    loadGlobalizeData();
  }
}
