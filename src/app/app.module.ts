import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypedFormExampleComponent } from './components/typed-form-example/typed-form-example.component';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NgFormHelpersModule, NgFormHelpersBootstrap4Module } from '@code-art/ng-form-helpers';
import { GlobalizeDataEnGBModule } from './globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataDeModule } from './globalize-data/globalize-data-de.module';
import { GlobalizeDataArEGModule } from './globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataModule } from './globalize-data/globalize-data.module';

@NgModule({
  declarations: [
    AppComponent,
    TypedFormExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgFormHelpersModule,
    NgFormHelpersModule.forRoot(),
    NgFormHelpersBootstrap4Module,
    AngularGlobalizeModule,
    AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']),
    GlobalizeDataEnGBModule,
    GlobalizeDataDeModule,
    GlobalizeDataArEGModule,
    GlobalizeDataModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
