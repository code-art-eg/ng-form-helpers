import { ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { TypedFormArray } from './typed-form-array';
import { TypedFormControl } from './typed-form-control';
import { TypedFormGroup } from './typed-form-group';

export type Typify<T> = { [ K in keyof T ]: T[ K ] };

export interface FormState<T> {
  value: T | null;
  disabled: boolean;
}

export type ValueOrFormState<T> = FormState<T> | T | null;
export type FormArrayState<T> = Array<ValueOrFormState<T>>;
export type FormGroupState<T extends Typify<T>> = {
  [P in keyof T]: FormState<Exclude<T[P], null>>;
};

export interface SetValueOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
}

export interface SetFormControlValueOptions extends SetValueOptions {
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export type FormGroupConfig<T> = {
  [P in keyof T]: FormControlType<Exclude<T[P], null>>;
};

export interface ControlType {
  _control?: undefined;
}

export type FormControlType<T> =
  T extends number ? TypedFormControl<number> :
  T extends string ? TypedFormControl<string> :
  T extends boolean ? TypedFormControl<boolean> :
  T extends Date ? TypedFormControl<Date> :
  T extends ControlType ? TypedFormControl<T> :
  T extends any[] ? TypedFormArray<T[number]> :
  T extends Typify<T> ? TypedFormGroup<T> :
  never;

export type FormControlFactory<T> = (v?: ValueOrFormState<T>) => FormControlType<T>;

export type TypedValidatorFn<T> = (c: FormControlType<T>) => ValidationErrors | null;
export type TypedAsyncValidatorFn<T> = (c: FormControlType<T>) =>
  Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
export type TypedValidators<T> = TypedValidatorFn<T> | Array<TypedValidatorFn<T>> | AbstractControlOptions | null;
export type TypedAsyncValidators<T> = TypedAsyncValidatorFn<T> | Array<TypedAsyncValidatorFn<T>> | null;

export interface ParameterizedMessage {
  messageKey: string;
  context?: string;
  parameters?: Record<string, any>;
}

export const FormValidationContext = 'formValidation';
export const FormFieldContext = 'formField';
export const NoContext = 'NoContext';
export interface MessageCollection {
  lang: string;
  messages: Record<string, string>;
  context?: string;
}
