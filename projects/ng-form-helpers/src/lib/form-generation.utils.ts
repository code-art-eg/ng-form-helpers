import { InjectionToken } from '@angular/core';
import { ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { ValidatorInfo, FormControlInfo, AsyncValidatorInfo } from './form-generation-models';
import { TypedFormControl } from './typed-form-control';

export const DefaultValidatorFactoryPriorityToken = new InjectionToken<number>('DefaultValidatorFactoryPriority');
export const DefaultFormControlFactoryPriorityToken = new InjectionToken<number>('DefaultFormControlFactoryPriority');
export const ValidatorFactoryToken = new InjectionToken<IValidatorFactory>('ValidatorFactoryToken');
export const FormControlFactoryToken = new InjectionToken<IValidatorFactory>('FormControlFactoryToken');

export const DefaultValidatorFactoryPriority = 1000;
export const DefaultFormControlFactoryPriority = 1000;

export interface IValidatorFactory {
  priority: number;
  createValidator(info: ValidatorInfo): ValidatorFn | null;
  createAsyncValidator(info: AsyncValidatorInfo): AsyncValidatorFn | null;
}

export interface IFormControlFactory {
  priority: number;
  createFormControl(info: FormControlInfo): TypedFormControl<any> | null;
}
