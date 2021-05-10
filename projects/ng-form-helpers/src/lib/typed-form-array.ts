import { FormArray, ValidatorFn, AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

import type {
  FormArrayState, FormControlFactory, FormControlType,
  SetValueOptions, TypedAsyncValidators, TypedValidators,
} from './form-models';

export class TypedFormArray<T> extends FormArray {
  // The following 3 fields are defined in the base class but redefined here to make them strongly typed.
  public readonly value!: T[];
  public readonly valueChanges!: Observable<T[]>;
  public controls!: Array<FormControlType<T>>;

  constructor(states: FormArrayState<T>, private readonly factory: FormControlFactory<T>,
              validatorOrOpts?: TypedValidators<T>,
              asyncValidator?: TypedAsyncValidators<T>) {
    super(TypedFormArray.initFormControls<T>(states, factory),
      validatorOrOpts as ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
      asyncValidator as AsyncValidatorFn | AsyncValidatorFn[] | null);
  }

  private static initFormControls<TForm>(
    states: FormArrayState<TForm>,
    factory: FormControlFactory<TForm>,
  ): Array<FormControlType<TForm>> {
    const result = [] as Array<FormControlType<TForm>>;
    if (states) {
      for (const state of states) {
        result.push(factory(state));
      }
    }
    return result;
  }


  public setValue(value: T[], options?: SetValueOptions): void {
    this.ensureArrayLength(value ? value.length : 0);
    super.setValue(value, options);
  }

  public patchValue(value: Array<Partial<T>>, options?: SetValueOptions): void {
    this.ensureArrayLength(value ? value.length : 0);
    super.patchValue(value, options);
  }

  public reset(state: FormArrayState<T>, options?: SetValueOptions) {
    this.ensureArrayLength(state ? state.length : 0);
    super.reset(state, options);
  }

  public pushNewItem(): FormControlType<T> {
    this.ensureArrayLength(this.length + 1);
    return this.controls[this.length - 1];
  }

  private ensureArrayLength(length: number): void {
    while (this.length > length) {
      this.removeAt(this.length - 1);
    }
    while (this.length < length) {
      this.push(this.factory());
    }
  }
}
