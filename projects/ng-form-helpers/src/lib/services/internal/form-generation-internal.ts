import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

import { IValidatorFactory } from '../../form-generation.utils';
import {
  ValidatorInfo,
  AsyncValidatorInfo,
  InputGroupText,
  InputGroupIcon,
  FormControlInfo,
  InputGroupInfo,
  FormArrayInfo,
  FormArrayItem,
  FormGroupInfo,
} from '../../form-generation-models';

export const createValidators = (
  service: string,
  validatorFactories: IValidatorFactory[],
  validatorInfos: ValidatorInfo[] | undefined | null,
): ValidatorFn[] => {
  const res: ValidatorFn[] = [];
  if (!validatorInfos) {
    return res;
  }
  for (const valInfo of validatorInfos) {
    let created = false;
    for (const factory of validatorFactories) {
      const val = factory.createValidator(valInfo);
      if (val) {
        res.push(val);
        created = true;
        break;
      }
    }
    if (!created) {
      throw new Error(`${service}:
      Cannot find a IValidatorFactory that can create validator with info: ${JSON.stringify(valInfo)}`);
    }
  }
  return res;
};

export const createAsyncValidators = (
  service: string,
  validatorFactories: IValidatorFactory[],
  validatorInfos: AsyncValidatorInfo[] | undefined | null,
): AsyncValidatorFn[] => {
  const res: AsyncValidatorFn[] = [];
  if (!validatorInfos) {
    return res;
  }
  for (const valInfo of validatorInfos) {
    let created = false;
    for (const factory of validatorFactories) {
      const val = factory.createAsyncValidator(valInfo);
      if (val) {
        res.push(val);
        created = true;
        break;
      }
    }
    if (!created) {
      throw new Error(`${service}:
      Cannot find a IValidatorFactory that can create async validator with info: ${JSON.stringify(valInfo)}`);
    }
  }
  return res;
};

export const isStringOrNullOrUndefined = (o: any): boolean => o === null || o === undefined || typeof o === 'string';
export const isBooleanOrNullOrUndefined = (o: any): boolean => o === null || o === undefined || typeof o === 'boolean';
export const isArrayOrNullOrUndefined = (o: any): boolean => o === null || o === undefined || Array.isArray(o);
export const isInputGroupText = (o: any): o is InputGroupText => o && typeof o === 'object' && typeof o.text === 'string';
export const isInputGroupIcon = (o: any): o is InputGroupIcon => o && typeof o === 'object' && typeof o.icon === 'string';

export const isFormControlInfo = (o: any): o is FormControlInfo => {
  if (!o || typeof o !== 'object') {
    return false;
  }
  const info = o as FormControlInfo;
  return typeof info.name === 'string'
    && isStringOrNullOrUndefined(info.label)
    && isBooleanOrNullOrUndefined(info.disabled)
    && isArrayOrNullOrUndefined(info.asyncValidators)
    && isArrayOrNullOrUndefined(info.validators);
};

export const isInputGroupInfo = (o: any): o is InputGroupInfo => {
  if (!o || typeof o !== 'object') {
    return false;
  }
  const info = o as InputGroupInfo;
  return isStringOrNullOrUndefined(info.id)
    && isStringOrNullOrUndefined(info.label)
    && Array.isArray(info.content);
};

export const isFormArrayInfo = (o: any): o is FormArrayInfo => {
  if (!o || typeof o !== 'object') {
    return false;
  }
  const info = o as FormArrayInfo;
  return isStringOrNullOrUndefined(info.name)
    && isFormArrayItem(info.itemType)
    && isArrayOrNullOrUndefined(info.asyncValidators)
    && isArrayOrNullOrUndefined(info.validators)
    && (isBooleanOrNullOrUndefined(info.allowAdd) || typeof info.allowAdd === 'function')
    && (isBooleanOrNullOrUndefined(info.allowDelete) || typeof info.allowDelete === 'function')
    ;
};

export const isFormArrayItem = (o: any): o is FormArrayItem => isFormControlInfo(o) || isFormGroupInfo(o);

export const isFormGroupInfo = (o: any): o is FormGroupInfo => {
  if (!o || typeof o !== 'object') {
    return false;
  }
  const info = o as FormGroupInfo;
  return typeof info.name === 'string'
    && isArrayOrNullOrUndefined(info.validators)
    && isArrayOrNullOrUndefined(info.validators)
    && Array.isArray(info.items);
};
