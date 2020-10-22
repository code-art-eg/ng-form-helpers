import { CommonValidators, FormFieldContext } from '../src/public_api';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Dictionary } from '@code-art-eg/angular-globalize/lib/models';

describe('CommonValidators', () => {

  describe('personName', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.personName(new FormControl(''))).toBeNull(); });

    it('should not error on null',
      () => { expect(CommonValidators.personName(new FormControl(null))).toBeNull(); });

    it('should not error on undefined',
      () => { expect(CommonValidators.personName(new FormControl(undefined))).toBeNull(); });

    it('should error if not a string',
      () => { expect(CommonValidators.personName(new FormControl(4))).toEqual({ personName: true }); });
    it('should error if non letter',
      () => { expect(CommonValidators.personName(new FormControl('a45'))).toEqual({ personName: true }); });
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
      () => { expect(CommonValidators.numeric(new FormControl('aa'))).toEqual({ numeric: true }); });
    it('should error if a string contains a number',
      () => { expect(CommonValidators.numeric(new FormControl('5'))).toEqual({ numeric: true }); });
    it('should error if NaN',
      () => { expect(CommonValidators.numeric(new FormControl(NaN))).toEqual({ numeric: true }); });
    it('should error if infinity',
      () => { expect(CommonValidators.numeric(new FormControl(Infinity))).toEqual({ numeric: true }); });
    it('should error if -infinity',
      () => { expect(CommonValidators.numeric(new FormControl(-Infinity))).toEqual({ numeric: true }); });
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
      () => { expect(CommonValidators.integer(new FormControl('aa'))).toEqual({ integer: true }); });
    it('should error if a string contains a number',
      () => { expect(CommonValidators.integer(new FormControl('5'))).toEqual({ integer: true }); });
    it('should error if NaN',
      () => { expect(CommonValidators.integer(new FormControl(NaN))).toEqual({ integer: true }); });
    it('should error if infinity',
      () => { expect(CommonValidators.integer(new FormControl(Infinity))).toEqual({ integer: true }); });
    it('should error if -infinity',
      () => { expect(CommonValidators.integer(new FormControl(-Infinity))).toEqual({ integer: true }); });
    it('should not error for non-integers',
      () => { expect(CommonValidators.integer(new FormControl(-5.5))).toEqual({ integer: true }); });
    it('should not error for integers',
      () => { expect(CommonValidators.integer(new FormControl(-5))).toBeNull(); });
  });

  describe('date', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.date(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.date(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.date(new FormControl(undefined))).toBeNull(); });

    it('should error if not a date',
      () => { expect(CommonValidators.date(new FormControl('aa'))).toEqual({ date: true }); });
    it('should not error if a date',
      () => {
        expect(CommonValidators.date(new FormControl(new Date()))).toBeNull();
      });

  });

  describe('minDate', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.minDate(new Date())(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.minDate(new Date())(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.minDate(new Date())(new FormControl(undefined))).toBeNull(); });

    it('should not error if not a date',
      () => { expect(CommonValidators.minDate(new Date())(new FormControl('aa'))).toBeNull(); });
    it('should error if before min date',
      () => {
        expect(CommonValidators.minDate(new Date(2000, 0, 1))(new FormControl(new Date(1999, 0, 1)))).toEqual(
          {
            minDate: {
              minDate: new Date(2000, 0, 1),
              actual: new Date(1999, 0, 1)
            },
          }
        );
      });
    it('should not error if same as min date',
      () => {
        expect(CommonValidators.minDate(new Date(1999, 0, 1))(new FormControl(new Date(1999, 0, 1)))).toBe(null);
      });
    it('should not error if after min date',
      () => {
        expect(CommonValidators.minDate(new Date(1999, 0, 1))(new FormControl(new Date(2000, 0, 1)))).toBe(null);
      });
  });

  describe('maxDate', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.maxDate(new Date())(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.maxDate(new Date())(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.maxDate(new Date())(new FormControl(undefined))).toBeNull(); });

    it('should not error if not a date',
      () => { expect(CommonValidators.maxDate(new Date())(new FormControl('aa'))).toBeNull(); });
    it('should error if after max date',
      () => {
        expect(CommonValidators.maxDate(new Date(1999, 0, 1))(new FormControl(new Date(2000, 0, 1)))).toEqual(
          {
            maxDate: {
              maxDate: new Date(1999, 0, 1),
              actual: new Date(2000, 0, 1)
            },
          }
        );
      });
    it('should not error if same as max date',
      () => {
        expect(CommonValidators.maxDate(new Date(1999, 0, 1))(new FormControl(new Date(1999, 0, 1)))).toBe(null);
      });
    it('should not error if before max date',
      () => {
        expect(CommonValidators.maxDate(new Date(2000, 0, 1))(new FormControl(new Date(1999, 0, 1)))).toBe(null);
      });
  });

  describe('future', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.future(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.future(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.future(new FormControl(undefined))).toBeNull(); });

    it('should not error if not a date',
      () => { expect(CommonValidators.future(new FormControl('aa'))).toBeNull(); });
    it('should error if past date',
      () => {
        expect(CommonValidators.future(new FormControl(new Date(2000, 0, 1)))).toEqual({
          future: true,
        }
        );
      });
    it('should not error if future date',
      () => {
        expect(CommonValidators.future(new FormControl(new Date(3999, 0, 1)))).toBe(null);
      });
  });

  describe('past', () => {
    it('should not error on an empty string',
      () => { expect(CommonValidators.past(new FormControl(''))).toBeNull(); });
    it('should not error on null',
      () => { expect(CommonValidators.past(new FormControl(null))).toBeNull(); });
    it('should not error on undefined',
      () => { expect(CommonValidators.past(new FormControl(undefined))).toBeNull(); });

    it('should not error if not a date',
      () => { expect(CommonValidators.past(new FormControl('aa'))).toBeNull(); });
    it('should error if future date',
      () => {
        expect(CommonValidators.past(new FormControl(new Date(3999, 0, 1)))).toEqual({
          past: true,
        }
        );
      });
    it('should not error if past date',
      () => {
        expect(CommonValidators.past(new FormControl(new Date(2000, 0, 1)))).toBe(null);
      });
  });

  describe('email', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.email(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.email(new FormControl(null))).toBeNull());

    it('should error on invalid email',
      () => expect(CommonValidators.email(new FormControl('text'))).toEqual({ email: true }));
    it('should error on invalid email with space',
      () => expect(CommonValidators.email(new FormControl('test text'))).toEqual({ email: true }));
    it('should not error on valid email',
      () => expect(CommonValidators.email(new FormControl('test@gmail.com'))).toBeNull());
  });

  describe('url', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.url(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.url(new FormControl(null))).toBeNull());

    it('should error on invalid url',
      () => expect(CommonValidators.url(new FormControl('text'))).toEqual({ url: true }));
    it('should error on invalid url with space',
      () => expect(CommonValidators.url(new FormControl('test text'))).toEqual({ url: true }));
    it('should not error on valid url',
      () => expect(CommonValidators.url(new FormControl('https://www.exampl.com'))).toBeNull());
    it('should not error on valid url with / path',
      () => expect(CommonValidators.url(new FormControl('https://www.exampl.com/'))).toBeNull());
    it('should not error on valid url with path',
      () => expect(CommonValidators.url(new FormControl('https://www.example.com/test/AAB-CccD-8aaaa_VGGGG/abcde'))).toBeNull());
    it('should not error on valid url with query',
      () => expect(CommonValidators.url(new FormControl('https://www.exampl.com/test/reew_eee/dds-ddd?test=aaa%20bb&x=111'))).toBeNull());
    it('should not error on valid url port',
      () => expect(CommonValidators.url(new FormControl('https://www.exampl.com:44233/test/reew_eee/dds-ddd'))).toBeNull());
    it('should not error on localhost',
      () => expect(CommonValidators.url(new FormControl('https://localhost/test/reew_eee/'))).toBeNull());
    it('should not error on localhost with port',
      () => expect(CommonValidators.url(new FormControl('https://localhost:44233/test/reew_eee/'))).toBeNull());
  });

  describe('color', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.color(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.color(new FormControl(null))).toBeNull());

    it('should error on invalid color',
      () => expect(CommonValidators.color(new FormControl('text'))).toEqual({ color: true }));
    it('should error on invalid color with space',
      () => expect(CommonValidators.color(new FormControl('test text'))).toEqual({ color: true }));
    it('should not error on valid color',
      () => expect(CommonValidators.color(new FormControl('#44ddaaee'))).toBeNull());
  });

  describe('phone', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.phone(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.phone(new FormControl(null))).toBeNull());

    it('should error on invalid phone',
      () => expect(CommonValidators.phone(new FormControl('test text'))).toEqual({ phone: true }));
    it('should not error on valid phone',
      () => expect(CommonValidators.phone(new FormControl('+1 800 555 5555'))).toBeNull());
  });

  describe('ageRange', () => {
    it('should not error on an empty string',
      () => expect(CommonValidators.ageRange(1, 2)(new FormControl(''))).toBeNull());

    it('should not error on null',
      () => expect(CommonValidators.ageRange(1, 2)(new FormControl(null))).toBeNull());

    it('should error on non date',
      () => expect(CommonValidators.ageRange(1, 100)(new FormControl(88))).toEqual(
        { ageRange: { minAge: 1, maxAge: 100, actual: 88 } }));
    it('should not error on valid age',
      () => expect(CommonValidators.ageRange(20, 30)(new FormControl(new Date(new Date().getFullYear() - 25, 1, 1)))).toBeNull());
    it('should error on invalid age',
      () => expect(CommonValidators.ageRange(20, 30)(new FormControl(new Date(new Date().getFullYear()
        - 31, new Date().getMonth(), new Date().getDate())))).toEqual({ ageRange: { minAge: 20, maxAge: 30, actual: 31 } }));
  });

  describe('compareValidators', () => {
    const form = new FormGroup({
      a: new FormControl(),
      b: new FormControl(),
    });
    const a = form.controls.a;
    const b = form.controls.b;
    function test(name: string, desc: string, aVal: any, bVal: any, error: boolean) {
      it(desc, () => {
        a.setValue(aVal);
        b.setValue(bVal);
        let f = (CommonValidators as any)[name] as (other: string) => ValidatorFn;
        f = f.bind(CommonValidators);
        const res = f('b')(a);
        if (error) {
          const e: Dictionary<any> = {};
          e[name + (aVal instanceof Date ? 'Date' : '')] = {
            otherKey: {
              messageKey: 'b',
              context: FormFieldContext,
            },
          };
          expect(res).toEqual(e);
        } else {
          expect(res).toBeNull();
        }
      });
    }

    describe('gte', () => {
      test('gte', 'should not error on an empty string', '', null, false);
      test('gte', 'should not error on null', null, 4, false);
      test('gte', 'should not error when other is empty string', 5, '', false);
      test('gte', 'should not error when other is null string', 5, null, false);
      test('gte', 'should not error when different types', 5, '6', false);
      test('gte', 'should error when other has greater numeric value', 5, 6, true);
      test('gte', 'should error when other has greater string value', 'A', 'B', true);
      test('gte', 'should error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), true);
      test('gte', 'should not error when other has same numeric value', 5, 5, false);
      test('gte', 'should not error when other has same string value', 'A', 'A', false);
      test('gte', 'should not error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), false);
      test('gte', 'should not error when other has smaller numeric value', 5, 4, false);
      test('gte', 'should not error when other has smaller string value', 'B', 'a', false);
      test('gte', 'should not error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), false);
    });

    describe('gt', () => {
      test('gt', 'should not error on an empty string', '', null, false);
      test('gt', 'should not error on null', null, 4, false);
      test('gt', 'should not error when other is empty string', 5, '', false);
      test('gt', 'should not error when other is null string', 5, null, false);
      test('gt', 'should not error when different types', 5, '6', false);
      test('gt', 'should error when other has greater numeric value', 5, 6, true);
      test('gt', 'should error when other has greater string value', 'A', 'B', true);
      test('gt', 'should error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), true);
      test('gt', 'should error when other has same numeric value', 5, 5, true);
      test('gt', 'should error when other has same string value', 'A', 'A', true);
      test('gt', 'should error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), true);
      test('gt', 'should not error when other has smaller numeric value', 5, 4, false);
      test('gt', 'should not error when other has smaller string value', 'B', 'a', false);
      test('gt', 'should not error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), false);
    });

    describe('lte', () => {
      test('lte', 'should not error on an empty string', '', null, false);
      test('lte', 'should not error on null', null, 4, false);
      test('lte', 'should not error when other is empty string', 5, '', false);
      test('lte', 'should not error when other is null string', 5, null, false);
      test('lte', 'should not error when different types', 5, '6', false);
      test('lte', 'should not error when other has greater numeric value', 5, 6, false);
      test('lte', 'should not error when other has greater string value', 'A', 'B', false);
      test('lte', 'should not error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), false);
      test('lte', 'should not error when other has same numeric value', 5, 5, false);
      test('lte', 'should not error when other has same string value', 'A', 'A', false);
      test('lte', 'should not error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), false);
      test('lte', 'should error when other has smaller numeric value', 5, 4, true);
      test('lte', 'should error when other has smaller string value', 'B', 'a', true);
      test('lte', 'should error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), true);
    });

    describe('lt', () => {
      test('lt', 'should not error on an empty string', '', null, false);
      test('lt', 'should not error on null', null, 4, false);
      test('lt', 'should not error when other is empty string', 5, '', false);
      test('lt', 'should not error when other is null string', 5, null, false);
      test('lt', 'should not error when different types', 5, '6', false);
      test('lt', 'should not error when other has greater numeric value', 5, 6, false);
      test('lt', 'should not error when other has greater string value', 'A', 'B', false);
      test('lt', 'should not error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), false);
      test('lt', 'should error when other has same numeric value', 5, 5, true);
      test('lt', 'should error when other has same string value', 'A', 'A', true);
      test('lt', 'should error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), true);
      test('lt', 'should error when other has smaller numeric value', 5, 4, true);
      test('lt', 'should error when other has smaller string value', 'B', 'a', true);
      test('lt', 'should error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), true);
    });

    describe('eq', () => {
      test('eq', 'should not error on an empty string', '', null, false);
      test('eq', 'should not error on null', null, 4, false);
      test('eq', 'should not error when other is empty string', 5, '', false);
      test('eq', 'should not error when other is null string', 5, null, false);
      test('eq', 'should not error when different types', 5, '6', false);
      test('eq', 'should error when other has greater numeric value', 5, 6, true);
      test('eq', 'should error when other has greater string value', 'A', 'B', true);
      test('eq', 'should error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), true);
      test('eq', 'should not error when other has same numeric value', 5, 5, false);
      test('eq', 'should not error when other has same string value', 'A', 'A', false);
      test('eq', 'should not error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), false);
      test('eq', 'should error when other has smaller numeric value', 5, 4, true);
      test('eq', 'should error when other has smaller string value', 'B', 'a', true);
      test('eq', 'should error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), true);
    });

    describe('neq', () => {
      test('neq', 'should not error on an empty string', '', null, false);
      test('neq', 'should not error on null', null, 4, false);
      test('neq', 'should not error when other is empty string', 5, '', false);
      test('neq', 'should not error when other is null string', 5, null, false);
      test('neq', 'should not error when different types', 5, '6', false);
      test('neq', 'should not error when other has greater numeric value', 5, 6, false);
      test('neq', 'should not error when other has greater string value', 'A', 'B', false);
      test('neq', 'should not error when other has greater date value', new Date(2000, 0, 1), new Date(2000, 0, 2), false);
      test('neq', 'should error when other has same numeric value', 5, 5, true);
      test('neq', 'should error when other has same string value', 'A', 'A', true);
      test('neq', 'should error when other has same date value', new Date(2000, 0, 1), new Date(2000, 0, 1), true);
      test('neq', 'should not error when other has smaller numeric value', 5, 4, false);
      test('neq', 'should not error when other has smaller string value', 'B', 'a', false);
      test('neq', 'should not error when other has smaller date value', new Date(2000, 0, 1), new Date(1999, 0, 1), false);
    });
  });
});

