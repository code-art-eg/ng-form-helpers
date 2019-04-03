import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ValidationMessagesInjectionToken, DEFAULT_VALIDATION_MESSAGES } from './services/validation-messages';
import { TranslationServiceInjectionToken, DefaultTranslationService } from './services/translation.service';
import { ToNullDirective, ToNumberDirective, ToIntegerDirective, RemoveHostDirective, ToDateDirective } from './directives';
import { ValidationErrorsComponent, ValidationSummaryComponent } from './components';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
// tslint:disable-next-line: deprecation
    RemoveHostDirective,
    ValidationErrorsComponent,
    ValidationSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
// tslint:disable-next-line: deprecation
    RemoveHostDirective,
    ValidationErrorsComponent,
    ValidationSummaryComponent,
  ],
  providers: [
    { provide: ValidationMessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
    { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService, }
  ]
})
export class NgFormHelpersModule { }
