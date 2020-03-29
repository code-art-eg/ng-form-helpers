import { Injectable, Optional, Inject } from '@angular/core';
import { ValidatorFn, Validators, AsyncValidatorFn } from '@angular/forms';

import { IValidatorFactory, DefaultFormControlFactoryPriorityToken, DefaultValidatorFactoryPriority } from '../form-generation.utils';
import { ValidatorInfo, AsyncValidatorInfo } from '../form-generation-models';
import { CommonValidators } from '../common-validators';
import { Dictionary } from '../form-models';
type ValidatorFactory = (...a: any[]) => ValidatorFn;
interface ValidatorConfig {
  isFunction: boolean;
  type: ValidatorFn | ValidatorFactory;
}

const ValidatorsConfig: Dictionary<ValidatorConfig> = {
  min: { isFunction: true, type: Validators.min },
  max: { isFunction: true, type: Validators.max },
  required: { isFunction: false, type: Validators.required },
  requiredTrue: { isFunction: false, type: Validators.requiredTrue },
  email: { isFunction: false, type: CommonValidators.email },
  minLength: { isFunction: true, type: Validators.minLength },
  maxLength: { isFunction: true, type: Validators.maxLength },
  pattern: { isFunction: true, type: Validators.pattern },
  personName: { isFunction: false, type: CommonValidators.personName },
  phone: { isFunction: false, type: CommonValidators.phone },
  integer: { isFunction: false, type: CommonValidators.integer },
  numeric: { isFunction: false, type: CommonValidators.numeric },
  date: { isFunction: false, type: CommonValidators.date },
  minDate: { isFunction: true, type: CommonValidators.minDate },
  maxDate: { isFunction: true, type: CommonValidators.maxDate },
  past: { isFunction: false, type: CommonValidators.past },
  future: { isFunction: false, type: CommonValidators.future },
  ageRange: { isFunction: true, type: CommonValidators.ageRange },
  gte: { isFunction: true, type: CommonValidators.gte },
  gt: { isFunction: true, type: CommonValidators.gt },
  lte: { isFunction: true, type: CommonValidators.lte },
  lt: { isFunction: true, type: CommonValidators.lt },
  eq: { isFunction: true, type: CommonValidators.eq },
  neq: { isFunction: true, type: CommonValidators.neq },
};

@Injectable({
  providedIn: 'root'
})
export class DefaultValidatorFactoryService implements IValidatorFactory {
  constructor(
    @Inject(DefaultFormControlFactoryPriorityToken) @Optional() public readonly priority: number,
  ) {
    this.priority = this.priority || DefaultValidatorFactoryPriority;
  }

  public createValidator(info: ValidatorInfo): ValidatorFn | null {
    const valConfig = ValidatorsConfig[info.name];
    if (!valConfig) {
      return null;
    }
    if (valConfig.isFunction) {
      return (valConfig.type as ValidatorFactory).apply(null, info.parameters || []);
    } else {
      return valConfig.type as ValidatorFn;
    }
  }

  public createAsyncValidator(info: AsyncValidatorInfo): AsyncValidatorFn | null {
    return null;
  }
}
