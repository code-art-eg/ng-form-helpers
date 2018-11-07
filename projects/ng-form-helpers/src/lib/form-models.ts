import { ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';

import { TypedFormArray } from './typed-form-array';
import { TypedFormControl } from './typed-form-control';
import { TypedFormGroup } from './typed-form-group';

export interface FormState<T> {
    value: T;
    disabled: boolean;
}

export type ValueOrFormState<T> = FormState<T> | T;
export type FormArrayState<T> = Array<ValueOrFormState<T>>;
export type FormGroupState<T extends object> = {
    [P in keyof T]: FormState<T[P]>;
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
    [P in keyof T]: FormControlType<T[P]>;
};

export type FormControlType<T> =
    T extends number ? TypedFormControl<number> :
    T extends string ? TypedFormControl<string> :
    T extends boolean ? TypedFormControl<boolean> :
    T extends Date ? TypedFormControl<Date> :
    T extends any[] ? TypedFormControl<T> | TypedFormArray<T[number]> :
    T extends object ? TypedFormGroup<T> | TypedFormControl<T> :
    never;

export type FormControlFactory<T> = (v?: ValueOrFormState<T>) => FormControlType<T>;

export type TypedValidatorFn<T> = (c: FormControlType<T>) => ValidationErrors | null;
export type TypedAsyncValidatorFn<T> = (c: FormControlType<T>) =>
        Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
export type TypedValidators<T> = TypedValidatorFn<T> | Array<TypedValidatorFn<T>> | AbstractControlOptions | null;
export type TypedAsyncValidators<T> = TypedAsyncValidatorFn<T> | Array<TypedAsyncValidatorFn<T>> | null;