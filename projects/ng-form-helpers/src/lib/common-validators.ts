import { Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { XRegExp } from 'xregexp';

const letterExpression = '(?:\\s|\\p{Ll}|\\p{Lu}|\\p{Lt}|\\p{Lo}|\\p{Lm})';
const nameRx = XRegExp(`^${letterExpression}+(?:-|'|${letterExpression})*$`);

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined || value === '' || typeof value === 'string' && /\s+/.test(value);
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
    if (typeof v !== 'number' || !isNaN(v) || !isFinite(v) || Math.round(v) !== v) {
      return { integer: true};
    }
    return null;
  }

  public static numeric(c: AbstractControl): ValidationErrors | null {
    const v = c.value;
    if (isEmptyValue(v)) {
      return null;
    }
    if (typeof v !== 'number' || !isNaN(v) || !isFinite(v)) {
      return { numeric: true};
    }
    return null;
  }

  public static ageRange(minAge: number, maxAge: number): ValidatorFn {
    return (c: AbstractControl) => {
      if (c.value instanceof Date) {
        const diff = (new Date().valueOf() - c.value.valueOf()) / 1000 / 3600 / 24 / 365;
        if (diff < minAge || diff > maxAge) {
          return { ageRange: { minAge: minAge, maxAge: maxAge, actual: diff } };
        }
      }
      return null;
    };
  }
}
