import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ToNullDirective,
  ToNumberDirective,
  ToIntegerDirective,
  RemoveHostDirective,
  ToDateDirective, ControlAutoStyleDirective,
} from './directives';
import { ValidationErrorsComponent, ValidationSummaryComponent } from './components';
import {
  ValidatorFactoryToken,
  FormControlFactoryToken,
  DefaultFormControlFactoryPriority,
  DefaultFormControlFactoryPriorityToken,
  DefaultValidatorFactoryPriority,
  DefaultValidatorFactoryPriorityToken
} from './form-generation.utils';
import {
  ValidationMessagesInjectionToken,
  TranslationServiceInjectionToken,
  DefaultTranslationService,
  DEFAULT_VALIDATION_MESSAGES,
  DefaultValidatorFactoryService,
  DefaultFormControlFactoryService,
} from './services';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    ToDateDirective,
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
    ControlAutoStyleDirective,
    ValidationErrorsComponent,
    ValidationSummaryComponent,
  ],
  providers: [
    { provide: ValidationMessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
    { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService, },
    { provide: ValidatorFactoryToken, useExisting: DefaultValidatorFactoryService, multi: true },
    { provide: FormControlFactoryToken, useExisting: DefaultFormControlFactoryService, multi: true },
    { provide: DefaultFormControlFactoryPriorityToken, useValue: DefaultFormControlFactoryPriority },
    { provide: DefaultValidatorFactoryPriorityToken, useValue: DefaultValidatorFactoryPriority },
  ]
})
export class NgFormHelpersModule { }
