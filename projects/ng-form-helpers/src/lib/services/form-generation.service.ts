import { Injectable, Inject } from '@angular/core';
import { ValidatorFactoryToken, IFormControlFactory, IValidatorFactory, FormControlFactoryToken } from '../form-generation.utils';
import { FormGroupInfo, FormControlInfo, FormArrayInfo } from '../form-generation-models';
import { TypedFormGroup } from '../typed-form-group';
import { Dictionary, FormGroupConfig } from '../form-models';
import { AbstractControl } from '@angular/forms';
import {
  isInputGroupInfo,
  isFormControlInfo,
  isFormGroupInfo, isFormArrayInfo,
  createValidators,
  createAsyncValidators,
} from './internal/form-generation-internal';
import { TypedFormArray } from '../typed-form-array';
import { TypedFormControl } from '../typed-form-control';

@Injectable({
  providedIn: 'root',
})
export class FormGenerationService {
  constructor(
    @Inject(ValidatorFactoryToken) private readonly _validatorFactories: IValidatorFactory[],
    @Inject(FormControlFactoryToken) private readonly _controlFactories: IFormControlFactory[],
  ) {
    _validatorFactories = this._validatorFactories.slice().sort((a, b) => a.priority - b.priority);
    _controlFactories = this._controlFactories.slice().sort((a, b) => a.priority - b.priority);
  }

  public createFormGroup<T extends object>(formGroupInfo: FormGroupInfo): TypedFormGroup<T> {
    const config: Dictionary<AbstractControl> = {};
    const items = this.flattenItems(formGroupInfo);
    for (const item of items) {
      if (isFormGroupInfo(item)) {
        config[item.name] = this.createFormGroup(item);
      } else if (isFormArrayInfo(item)) {
        config[item.name] = this.createFormArray(item);
      } else {
        config[item.name] = this.createFormControl(item);
      }
    }
    return new TypedFormGroup<any>(
      config as FormGroupConfig<any>,
      createValidators('FormGenerationService', this._validatorFactories, formGroupInfo.validators),
      createAsyncValidators('FormGenerationService', this._validatorFactories, formGroupInfo.asyncValidators),
    );
  }

  private createFormArray(formArrayInfo: FormArrayInfo): TypedFormArray<any> {
    return new TypedFormArray<any>(
      [],
      () => isFormGroupInfo(formArrayInfo.itemType) ?
        this.createFormGroup(formArrayInfo.itemType) : this.createFormControl(formArrayInfo.itemType),
      createValidators('FormGenerationService', this._validatorFactories, formArrayInfo.validators),
      createAsyncValidators('FormGenerationService', this._validatorFactories, formArrayInfo.asyncValidators),
    );
  }

  private createFormControl(formControlInfo: FormControlInfo): TypedFormControl<any> {
    for (const factory of this._controlFactories) {
      const c = factory.createFormControl(formControlInfo);
      if (c) {
        return c;
      }
    }
    throw new Error(`FormGenerationService:
      Cannot find a IFormControlFactory that can create form control with info: ${JSON.stringify(formControlInfo)}
    `);
  }

  private flattenItems(formGroupInfo: FormGroupInfo): Array<FormGroupInfo | FormControlInfo | FormArrayInfo> {
    const res: Array<FormGroupInfo | FormControlInfo | FormArrayInfo> = [];
    for (const item of formGroupInfo.items) {
      if (isInputGroupInfo(item)) {
        for (const subItem of item.content) {
          if (isFormControlInfo(subItem)) {
            res.push(subItem);
          }
        }
      } else {
        res.push(item);
      }
    }
    return res;
  }

}
