import { InjectionToken } from '@angular/core';
import { StringDictionary } from '../form-models';

export const DEFAULT_VALIDATION_MESSAGES: StringDictionary = {
  'min': 'Value of {key} must be greater than or equal to {min}.',
  'max': 'Value of {key} must be less than or equal to {max}.',
  'required': '{key} is required.',
  'requiredTrue': '{key} must be checked.',
  'email': '{key} must be valid email address.',
  'minLength': 'The length of {key} must be greater than or equal to {minLength}.',
  'maxLength': 'The length of {key} must be less than or equal to {maxLength}.',
  'pattern': 'The value of {key} is invalid.',
};

export const ValidationMessagesInjectionToken = new InjectionToken<StringDictionary>('ValidationMessages');
