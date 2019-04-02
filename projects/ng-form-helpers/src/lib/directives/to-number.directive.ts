import { Directive, forwardRef } from '@angular/core';
import { BaseConverterDirective } from './base-converter-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToNumberDirective),
  }],
  selector: '[frmToNumber]'
})
export class ToNumberDirective extends BaseConverterDirective<number> {

  protected coerceValue(v: any): number | null | undefined {
    if (v === null || v === undefined) {
      return null;
    } else if (typeof v === 'string' && /^\s*$/.test(v)) {
      return null;
    }
    const val = this.typeConverter.convertToNumber(v);
    const valid = typeof val === 'number' && !isNaN(val) && val !== Infinity && val !== -Infinity;
    return valid ? val : undefined;
  }

  protected formatValue(v: number): string {
    return this.typeConverter.convertToString(v) as string;
  }

  protected valuesAreEqual(v1: number|null, v2: number|null): boolean {
    return v1 === v2;
  }
}
