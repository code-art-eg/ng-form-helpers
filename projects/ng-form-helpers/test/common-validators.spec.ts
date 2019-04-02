import { CommonValidators } from '../src/public_api';
import { FormControl } from '@angular/forms';

describe('CommonValidators', () => {

  describe('personName', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.personName(new FormControl(''))).toBeNull(); });

    it('should not error on null',
      () => { expect(CommonValidators.personName(new FormControl(null))).toBeNull(); });

    it('should not error on undefined',
      () => { expect(CommonValidators.personName(new FormControl(undefined))).toBeNull(); });

    it('should error if not a string',
      () => { expect(CommonValidators.personName(new FormControl(4))).toEqual({ 'personName': true }); });
    it('should error if non letter',
      () => { expect(CommonValidators.personName(new FormControl('a45'))).toEqual({ 'personName': true }); });
    it('should not error for english names',
      () => { expect(CommonValidators.personName(new FormControl('Robert'))).toBeNull(); });
    it('should not error for western european names',
      () => { expect(CommonValidators.personName(new FormControl('Gauß'))).toBeNull(); });
    it('should not error for names with spaces ',
      () => { expect(CommonValidators.personName(new FormControl('André Gauß'))).toBeNull(); });
    it('should not error for names with apostrophe',
      () => { expect(CommonValidators.personName(new FormControl('O\'neil'))).toBeNull(); });
    it('should not error for names with hyphen or space',
      () => { expect(CommonValidators.personName(new FormControl('Mary-Jane Watson'))).toBeNull(); });
    it('should not error for arabic names',
      () => { expect(CommonValidators.personName(new FormControl('عًمر'))).toBeNull(); });
    it('should not error for greek names',
      () => { expect(CommonValidators.personName(new FormControl('Αλέξης'))).toBeNull(); });
    it('should not error for cyrillic names',
      () => { expect(CommonValidators.personName(new FormControl('Влади́мир'))).toBeNull(); });
  });

  describe('numeric', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.numeric(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.numeric(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.numeric(new FormControl(undefined))).toBeNull(); });

    it('should error if not a number',
      () => { expect(CommonValidators.numeric(new FormControl('aa'))).toEqual({ 'numeric': true }); });
    it('should error if a string contains a number',
      () => { expect(CommonValidators.numeric(new FormControl('5'))).toEqual({ 'numeric': true }); });
    it('should error if NaN',
      () => { expect(CommonValidators.numeric(new FormControl(NaN))).toEqual({ 'numeric': true }); });
    it('should error if infinity',
      () => { expect(CommonValidators.numeric(new FormControl(Infinity))).toEqual({ 'numeric': true }); });
    it('should error if -infinity',
      () => { expect(CommonValidators.numeric(new FormControl(-Infinity))).toEqual({ 'numeric': true }); });
    it('should not error for numbers',
      () => { expect(CommonValidators.numeric(new FormControl(-5.5))).toBeNull(); });
  });
  describe('integer', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.integer(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.integer(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.integer(new FormControl(undefined))).toBeNull(); });

    it('should error if not a number',
      () => { expect(CommonValidators.integer(new FormControl('aa'))).toEqual({ 'integer': true }); });
    it('should error if a string contains a number',
      () => { expect(CommonValidators.integer(new FormControl('5'))).toEqual({ 'integer': true }); });
    it('should error if NaN',
      () => { expect(CommonValidators.integer(new FormControl(NaN))).toEqual({ 'integer': true }); });
    it('should error if infinity',
      () => { expect(CommonValidators.integer(new FormControl(Infinity))).toEqual({ 'integer': true }); });
    it('should error if -infinity',
      () => { expect(CommonValidators.integer(new FormControl(-Infinity))).toEqual({ 'integer': true }); });
    it('should not error for non-integers',
      () => { expect(CommonValidators.integer(new FormControl(-5.5))).toEqual({ 'integer': true }); });
    it('should not error for integers',
      () => { expect(CommonValidators.integer(new FormControl(-5))).toBeNull(); });
  });

  describe('email', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.email(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.email(new FormControl(null))).toBeNull());

    it('should error on invalid email',
      () => expect(CommonValidators.email(new FormControl('text'))).toEqual({ 'email': true }));
    it('should error on invalid email with space',
      () => expect(CommonValidators.email(new FormControl('test text'))).toEqual({ 'email': true }));
    it('should not error on valid email',
      () => expect(CommonValidators.email(new FormControl('test@gmail.com'))).toBeNull());
  });

  describe('phone', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.phone(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.phone(new FormControl(null))).toBeNull());

    it('should error on invalid phone',
      () => expect(CommonValidators.phone(new FormControl('test text'))).toEqual({ 'phone': true }));
    it('should not error on valid phone',
      () => expect(CommonValidators.phone(new FormControl('+1 800 555 5555'))).toBeNull());
  });

  describe('ageRange', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.ageRange(1, 2)(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.ageRange(1, 2)(new FormControl(null))).toBeNull());

    it('should error on non date',
      () => expect(CommonValidators.ageRange(1, 100)(new FormControl(88))).toEqual({ 'ageRange': { minAge: 1, maxAge: 100, actual: 88 } }));
    it('should not error on valid age',
      () => expect(CommonValidators.ageRange(20, 30)(new FormControl(new Date(new Date().getFullYear() - 25, 1, 1)))).toBeNull());
    it('should error on invalid age',
      () => expect(CommonValidators.ageRange(20, 30)(new FormControl(new Date(new Date().getFullYear()
         - 31, new Date().getMonth(), new Date().getDate())))).toEqual({'ageRange': { minAge: 20, maxAge: 30, actual: 31 } }));
  });
});
