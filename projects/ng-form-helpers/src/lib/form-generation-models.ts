import { FormArray } from '@angular/forms';

export interface ValidatorInfo {
  name: string;
  parameters?: any[] | null;
}

export interface AsyncValidatorInfo {
  name?: string | null;
  path?: string | null;
  parameters?: any[] | null;
}

export interface FormControlInfo {
  name: string;
  label?: string | null;
  initialValue?: any;
  disabled?: boolean | null;
  validators?: ValidatorInfo[] | null;
  asyncValidators?: AsyncValidatorInfo[] | null;
}

export interface InputGroupText {
  text: string;
}

export interface InputGroupIcon {
  icon: string;
}

export type InputGroupItem = InputGroupText | InputGroupIcon | FormControlInfo;

export interface InputGroupInfo {
  id?: string | null;
  label?: string | null;
  content: InputGroupItem[];
}

export type FormGroupItem = InputGroupInfo | FormGroupInfo | FormControlInfo | FormArrayInfo;

export interface FormGroupInfo {
  name: string;
  validators?: ValidatorInfo[] | null;
  asyncValidators?: AsyncValidatorInfo[] | null;
  items: FormGroupItem[];
}

export type FormArrayItem = FormGroupInfo | FormControlInfo;
export type FormArrayPredicate = (formArray?: FormArray, info?: FormArrayInfo, index?: number) => boolean;

export interface FormArrayInfo {
  name: string;
  itemType: FormArrayItem;
  validators?: ValidatorInfo[] | null;
  asyncValidators?: AsyncValidatorInfo[] | null;
  allowAdd?: boolean | FormArrayPredicate | null;
  allowDelete?: boolean | FormArrayPredicate | null;
}
