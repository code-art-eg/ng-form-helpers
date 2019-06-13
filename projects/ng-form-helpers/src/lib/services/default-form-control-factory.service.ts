
import {
  IFormControlFactory,
  DefaultFormControlFactoryPriorityToken,
  DefaultFormControlFactoryPriority,
  ValidatorFactoryToken, IValidatorFactory,
} from '../form-generation.utils';
import { FormControlInfo } from '../form-generation-models';
import { Injectable, Inject, Optional } from '@angular/core';
import { TypedFormControl } from '../typed-form-control';
import { createValidators, createAsyncValidators } from './internal/form-generation-internal';

@Injectable({
  providedIn: 'root',
})
export class DefaultFormControlFactoryService implements IFormControlFactory {
  constructor(
    @Inject(DefaultFormControlFactoryPriorityToken) @Optional() public readonly priority: number,
    @Inject(ValidatorFactoryToken) private readonly _validatorFactories: IValidatorFactory[],
  ) {
    if (!this.priority) {
      this.priority = DefaultFormControlFactoryPriority;
    }
    _validatorFactories = this._validatorFactories.slice().sort((a, b) => a.priority - b.priority);
  }

  public createFormControl(info: FormControlInfo): TypedFormControl<any> | null {
    return new TypedFormControl<any>({
      value: info.initialValue === undefined ? null : info.initialValue,
      disabled: !!info.disabled,
    },
      createValidators('DefaultFormControlFactoryService', this._validatorFactories, info.validators),
      createAsyncValidators('DefaultFormControlFactoryService', this._validatorFactories, info.asyncValidators),
    );
  }
}
