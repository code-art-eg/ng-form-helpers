import { InjectionToken } from '@angular/core';
import { StringDictionary } from '../form-models';

export const DEFAULT_VALIDATION_MESSAGES: StringDictionary = {
  'validationSummary': 'One of more form fields need your attention',
  'min': 'Value of {key} must be greater than or equal to {min}.',
  'max': 'Value of {key} must be less than or equal to {max}.',
  'required': '{key} is required.',
  'requiredTrue': '{key} must be checked.',
  'email': '{key} must be valid email address.',
  'url': '{key} must be valid url value.',
  'color': '{key} must be valid color value.',
  'minlength': 'The length of {key} must be greater than or equal to {requiredLength}.',
  'maxlength': 'The length of {key} must be less than or equal to {requiredLength}.',
  'pattern': 'The value of {key} is invalid.',
  'personName': 'The value of {key} must be a valid name.',
  'phone': 'The value of {key} must be a valid phone number.',
  'integer': 'The value of {key} must be an integer.',
  'numeric': 'The value of {key} must be a number.',
  'date': '{key} must be a valid date.',
  'minDate': '{key} must be at or after {minDate}.',
  'maxDate': '{key} must be at or before {maxDate}.',
  'past': 'The value of {key} must be a past date.',
  'future': 'The value of {key} must be a future date.',
  'gte': 'The value of {key} must be greater than or equal to the value of {otherKey}.',
  'gt': 'The value of {key} must be greater than the value of {otherKey}.',
  'lte': 'The value of {key} must be less than or equal to the value of {otherKey}.',
  'lt': 'The value of {key} must be less than the value of {otherKey}.',
  'neq': 'The value of {key} must be different from the value of {otherKey}.',
  'eq': 'The value of {key} must be the same as the value of {otherKey}.',
  'gteDate': '{key} must be after or same as {otherKey}.',
  'gtDate': '{key} must be after {otherKey}.',
  'lteDate': '{key} must be before or same as {otherKey}.',
  'ltDate': '{key} must be less than {otherKey}.',
  'neqDate': '{key} must be different from {otherKey}.',
  'eqDate': '{key} must be the same {otherKey}.',
};

export const ValidationMessagesInjectionToken = new InjectionToken<StringDictionary>('ValidationMessages');
