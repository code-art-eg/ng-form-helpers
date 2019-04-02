import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { ValidationMessagesInjectionToken, DEFAULT_VALIDATION_MESSAGES } from './services/validation-messages';
import { TranslationServiceInjectionToken, DefaultTranslationService } from './services/translation.service';
import { ToNullDirective, ToNumberDirective, ToIntegerDirective, RemoveHostDirective, ToDateDirective } from './directives';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
// tslint:disable-next-line: deprecation
    RemoveHostDirective
  ],
  imports: [
    FormsModule
  ],
  exports: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
// tslint:disable-next-line: deprecation
    RemoveHostDirective
  ],
  providers: [
    { provide: ValidationMessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
    { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService, }
  ]
})
export class NgFormHelpersModule { }
