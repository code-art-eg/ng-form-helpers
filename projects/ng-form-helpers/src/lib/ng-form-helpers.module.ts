import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToNullDirective } from './directives/to-null.directive';
import { ToNumberDirective } from './directives/to-number.directive';
import { ToIntegerDirective } from './directives/to-integer.directive';
import { RemoveHostDirective } from './directives/remove-host.directive';
import { ValidationMessagesInjectionToken, DEFAULT_VALIDATION_MESSAGES } from './services/validation-messages';
import { TranslationServiceInjectionToken, DefaultTranslationService } from './services/translation.service';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
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
// tslint:disable-next-line: deprecation
    RemoveHostDirective
  ],
  providers: [
    { provide: ValidationMessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
    { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService, }
  ]
})
export class NgFormHelpersModule { }
