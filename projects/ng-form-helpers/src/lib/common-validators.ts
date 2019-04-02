import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import XRegExp from 'xregexp';
import { FormHelpers } from './form-helpers';
import { Dictionary } from '@code-art/angular-globalize/lib/models';
import { FormFieldContext } from './form-models';

const letterExpression = '(?:\\p{M}|\\p{Ll}|\\p{Lu}|\\p{Lt}|\\p{Lo}|\\p{Lm})';
const nameRx = XRegExp(`^${letterExpression}+(?:-|'| |${letterExpression})*$`);

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined || value === '' || typeof value === 'string' && /^\s+$/.test(value);
}

export class CommonValidators {

  public static personName(c: AbstractControl): ValidationErrors | null {
    if (isEmptyValue(c.value)) {
      return null;
    }
    if (!nameRx.test(c.value)) {
      return { personName: true };
    }
    return null;
  }

  public static email(c: AbstractControl): ValidationErrors | null {
    if (isEmptyValue(c.value)) {
      return null;
    }
    if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(c.value)) {
      return { email: true };
    }
    return null;
  }

  public static phone(c: AbstractControl): ValidationErrors | null {
    if (isEmptyValue(c.value)) {
      return null;
    }
    if (!/^(\(?\+?[0-9]*\)?)?[0-9_\-\/\\ ()]*$/.test(c.value)) {
      return { phone: true };
    }
    return null;
  }

  public static integer(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (typeof v !== 'number' || isNaN(v) || !isFinite(v) || Math.round(v) !== v) {
      return { integer: true };
    }
    return null;
  }

  public static date(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (v instanceof Date) {
      return null;
    }
    return { date: true };
  }

  public static minDate(minDate: Date): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const v = c.value;
      if (isEmptyValue(v)) {
        return null;
      }
      if (v instanceof Date) {
        return v.valueOf() >= minDate.valueOf() ? null : { minDate: { minDate: minDate, actual: v } };
      }
      return null;
    };
  }

  public static maxDate(maxDate: Date): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const v = c.value;
      if (isEmptyValue(v)) {
        return null;
      }
      if (v instanceof Date) {
        return v.valueOf() <= maxDate.valueOf() ? null : { maxDate: { maxDate: maxDate, actual: v } };
      }
      return null;
    };
  }

  public static past(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (v instanceof Date) {
      return v.valueOf() < new Date().valueOf() ? null : { past: true};
    }
    return null;
  }

  public static future(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (v instanceof Date) {
      return v.valueOf() > new Date().valueOf() ? null : { future: true};
    }
    return null;
  }

  public static numeric(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (typeof v !== 'number' || isNaN(v) || !isFinite(v)) {
      return { numeric: true };
    }
    return null;
  }

  public static ageRange(minAge: number, maxAge: number): ValidatorFn {
    return (c: AbstractControl) => {
      if (isEmptyValue(c.value)) {
        return null;
      }
      if (c.value instanceof Date) {
        const diff = Math.floor((new Date().valueOf() - c.value.valueOf()) / 1000 / 3600 / 24 / 365);
        if (diff < minAge || diff > maxAge) {
          return { ageRange: { minAge: minAge, maxAge: maxAge, actual: diff } };
        }
      } else {
        return { ageRange: { minAge: minAge, maxAge: maxAge, actual: c.value } };
      }
      return null;
    };
  }

  public static gte(otherKey: string | number): ValidatorFn {
    return this.compareValidator('gte', otherKey, (r) => r >= 0);
  }

  public static gt(otherKey: string | number): ValidatorFn {
    return this.compareValidator('gt', otherKey, (r) => r > 0);
  }

  public static lte(otherKey: string | number): ValidatorFn {
    return this.compareValidator('lte', otherKey, (r) => r <= 0);
  }

  public static lt(otherKey: string | number): ValidatorFn {
    return this.compareValidator('lt', otherKey, (r) => r < 0);
  }

  public static eq(otherKey: string | number): ValidatorFn {
    return this.compareValidator('eq', otherKey, (r) => r === 0);
  }

  public static neq(otherKey: string | number): ValidatorFn {
    return this.compareValidator('neq', otherKey, (r) => r !== 0);
  }

  private static compareValidator(name: string, otherKey: string | number, oper: (r: number) => boolean): ValidatorFn {
    return (c: AbstractControl) => {
      const compareResult = this.compareValues(c, otherKey);
      if (compareResult === null || oper(compareResult)) {
        return null;
      }
      const res: Dictionary<any> = {};
      res[name] = {
        otherKey: {
          messageKey: otherKey,
          context: FormFieldContext,
        },
      };
      return res;
    };
  }

  private static compareValues(c: AbstractControl, otherKey: string | number): number | null {
    if (isEmptyValue(c.value)) {
      return null;
    }
    const otherCtl = FormHelpers.getSibling(c, otherKey);
    if (!otherCtl) {
      return null;
    }
    if (isEmptyValue(otherCtl.value)) {
      return null;
    }
    if (typeof c.value !== typeof otherCtl.value) {
      return null;
    }
    if (typeof c.value === 'number' || c.value instanceof Date) {
      return c.value.valueOf() - (otherCtl.value as number | Date).valueOf();
    } else if (typeof c.value === 'string') {
      return c.value.localeCompare(otherCtl.value);
    }
    return null;
  }
}
