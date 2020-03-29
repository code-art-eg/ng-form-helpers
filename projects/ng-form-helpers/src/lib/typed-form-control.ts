import { FormControl, AbstractControlOptions, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  SetFormControlValueOptions, SetValueOptions, TypedAsyncValidators,
  TypedValidators, ValueOrFormState
} from './form-models';

export class TypedFormControl<T> extends FormControl {
  // The following 2 fields are defined in the base class but redefined here to make them strongly typed.
  public readonly value!: T;
  public readonly valueChanges!: Observable<T>;
  constructor(state: ValueOrFormState<T>,
              validatorOrOpts?: TypedValidators<T>,
              asyncValidator?: TypedAsyncValidators<T>,
  ) {
    super(state,
      validatorOrOpts as ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
      asyncValidator as AsyncValidatorFn | AsyncValidatorFn[] | null);
  }

  public setValue(value: T, options?: SetFormControlValueOptions): void {
    super.setValue(value, options);
  }

  public patchValue(value: T, options?: SetFormControlValueOptions): void {
    super.patchValue(value, options);
  }

  public reset(state: T, options: SetValueOptions): void {
    super.reset(state, options);
  }
}
