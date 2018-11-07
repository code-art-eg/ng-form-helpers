import { FormGroup, ValidatorFn, AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

import { FormGroupConfig, FormGroupState,
     SetValueOptions, TypedAsyncValidators, TypedValidators, ValueOrFormState } from './form-models';

export class TypedFormGroup<T extends object> extends FormGroup {
    // The following 2 fields are defined in the base class but redefined here to make them strongly typed.
    public readonly value!: T;
    public readonly valueChanges!: Observable<T>;

    constructor(public controls: FormGroupConfig<T>,
                validatorOrOpts?: TypedValidators<T>,
                asyncValidator?: TypedAsyncValidators<T>) {
        super(controls,
            validatorOrOpts as ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
            asyncValidator as AsyncValidatorFn | AsyncValidatorFn[] | null
        );
    }

    public setValue(value: T,
                    options?: SetValueOptions): void {
        super.setValue(value, options);
    }

    public patchValue(value: Partial<T>,
                      options?: SetValueOptions): void {
        super.patchValue(value, options);
    }

    public reset(state: FormGroupState<T>, options?: SetValueOptions): void {
        super.reset(state, options);
    }
}
