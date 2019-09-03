import { Directive, forwardRef, Input } from '@angular/core';
import { BaseConverterDirective } from './base-converter-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateFormatterOptions } from 'globalize';
import { GlobalizationService } from '@code-art/angular-globalize';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToDateDirective),
  }],
  selector: '[frmToDate]'
})
export class ToDateDirective extends BaseConverterDirective<Date> {

  @Input() public frmDateFormat: DateFormatterOptions | undefined = undefined;
  private _globalizationService?: GlobalizationService;

  protected coerceValue(v: any): Date | null | undefined {
    if (v === null || v === undefined) {
      return null;
    } else if (typeof v === 'string' && /^\s*$/.test(v)) {
      return null;
    }
    try {
      if (this.frmDateFormat) {
        const srv = this._globalizationService
        || (this._globalizationService = this.injector.get<GlobalizationService>(GlobalizationService));
        const val = srv.parseDate(v, this.frmDateFormat);
        return val || undefined;
      } else {
        const val = this.typeConverter.convertToDate(v);
        return val;
      }

    } catch {
      return undefined;
    }
  }

  protected formatValue(v: Date): string {
    if (this.frmDateFormat) {
      const srv = this._globalizationService
        || (this._globalizationService = this.injector.get<GlobalizationService>(GlobalizationService));
      return srv.formatDate(v, this.frmDateFormat);
    }
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
