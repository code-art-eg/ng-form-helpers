import { Directive, forwardRef } from '@angular/core';
import { BaseConverterDirective } from './base-converter-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToDateDirective),
  }],
  selector: '[frmToDate]'
})
export class ToDateDirective extends BaseConverterDirective<Date> {

  protected coerceValue(v: any): Date | null | undefined {
    if (v === null || v === undefined) {
      return null;
    } else if (typeof v === 'string' && /^\s*$/.test(v)) {
      return null;
    }
    try {
      const val = this.typeConverter.convertToDate(v);
      return val;
    } catch {
      return undefined;
    }
  }

  protected formatValue(v: Date): string {
    return this.typeConverter.convertToString(v) as string;
  }

  protected valuesAreEqual(v1: Date | null, v2: Date | null): boolean {
    if (v1 === null) {
      return v2 === null;
    } else if (v2 === null) {
      return false;
    }
    return v1.valueOf() === v2.valueOf();
  }
}
