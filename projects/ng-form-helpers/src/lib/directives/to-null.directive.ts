import { Directive, forwardRef } from '@angular/core';
import { BaseConverterDirective } from './base-converter-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ToNullDirective),
  }],
  selector: '[frmToNull]',
})
export class ToNullDirective extends BaseConverterDirective<any>  {

  protected coerceValue(v: any): string | null | undefined {
    if (v === null || v === undefined) {
      return null;
    } else if (typeof v === 'string') {
      if (/^\s*$/.test(v)) {
        return null;
      }
    }
    return v;
  }

  protected formatValue(v: any): string {
    if (v === null || v === undefined) {
      return '';
    } else if (typeof v === 'string') {
      return v;
    }
    return this.typeConverter.convertToString(v) as string;
  }

  protected valuesAreEqual(v1: any, v2: any): boolean {
    return v1 === v2;
  }
}
