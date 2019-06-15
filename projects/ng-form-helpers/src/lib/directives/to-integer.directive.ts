import { Directive, forwardRef } from '@angular/core';
import { ToNumberDirective } from './to-number.directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ToIntegerDirective),
  }],
  selector: '[frmToInteger]'
})
export class ToIntegerDirective extends ToNumberDirective {

  protected coerceValue(v: string): number | null | undefined {
    const val = super.coerceValue(v);
    if (typeof val === 'number' && val !== Math.round(val)) {
      return undefined;
    }
    return val;
  }
}
