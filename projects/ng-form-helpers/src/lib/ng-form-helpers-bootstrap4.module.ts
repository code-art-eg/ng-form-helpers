import { NgModule } from '@angular/core';
import {
  ValidationErrorCssClassToken,
  FormControlCssClassToken,
  FormControlValidCssClassToken,
  FormControlInvalidCssClassToken,
  ValidationSummaryContainerCssClassToken,
  ValidationSummaryHeaderCssClassToken,
  ValidationSummaryErrorCssClassToken,
  FormControlCheckCssClassToken,
} from './css-constants';

@NgModule({
  providers: [
    { provide: ValidationErrorCssClassToken, useValue: 'invalid-feedback' },
    { provide: FormControlCssClassToken, useValue: 'form-control' },
    { provide: FormControlCheckCssClassToken, useValue: 'form-check-input' },
    { provide: FormControlValidCssClassToken, useValue: 'is-valid' },
    { provide: FormControlInvalidCssClassToken, useValue: 'is-invalid' },
    { provide: ValidationSummaryContainerCssClassToken, useValue: 'alert alert-danger my-3' },
    { provide: ValidationSummaryHeaderCssClassToken, useValue: 'alert-heading' },
    { provide: ValidationSummaryErrorCssClassToken, useValue: 'small' },
  ]
})
export class NgFormHelpersBootstrap4Module { }
