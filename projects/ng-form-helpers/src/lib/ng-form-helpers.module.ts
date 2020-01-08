import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import {
  ValidatorFactoryToken,
  FormControlFactoryToken,
  DefaultFormControlFactoryPriority,
  DefaultFormControlFactoryPriorityToken,
  DefaultValidatorFactoryPriority,
  DefaultValidatorFactoryPriorityToken
} from './form-generation.utils';

import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { ValidationSummaryComponent } from './components/validation-summary/validation-summary.component';
import { DefaultValidatorFactoryService } from './services/default-validator-factory.service';
import { DefaultFormControlFactoryService } from './services/default-form-control-factory.service';
import { ToNullDirective } from './directives/to-null.directive';
import { ToNumberDirective } from './directives/to-number.directive';
import { ToIntegerDirective } from './directives/to-integer.directive';
import { ToDateDirective } from './directives/to-date.directive';
import { RemoveHostDirective } from './directives/remove-host.directive';
import { ControlAutoStyleDirective } from './directives/control-auto-style.directive';
import { ValidationMessagesInjectionToken, DEFAULT_VALIDATION_MESSAGES } from './services/validation-messages';
import { DefaultTranslationService, TranslationServiceInjectionToken } from './services/translation.service';
import { TranslationKeyPrefixDirective } from './directives/translation-key-prefix.directive';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
    TranslationKeyPrefixDirective,
    // tslint:disable-next-line: deprecation
    RemoveHostDirective,
    ControlAutoStyleDirective,
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
    TranslationKeyPrefixDirective,
    ControlAutoStyleDirective,
    ValidationErrorsComponent,
    ValidationSummaryComponent,
  ],
})
export class NgFormHelpersModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgFormHelpersModule,
      providers: [
        { provide: ValidationMessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
        { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService, },
        { provide: ValidatorFactoryToken, useExisting: DefaultValidatorFactoryService, multi: true },
        { provide: FormControlFactoryToken, useExisting: DefaultFormControlFactoryService, multi: true },
        { provide: DefaultFormControlFactoryPriorityToken, useValue: DefaultFormControlFactoryPriority },
        { provide: DefaultValidatorFactoryPriorityToken, useValue: DefaultValidatorFactoryPriority },
      ],
    };
  }
}
