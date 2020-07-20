import { Directive, forwardRef, Input, Injector } from '@angular/core';
import { BaseConverterDirective } from './base-converter-directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypeConverterService, CurrentCultureService, GlobalizationService } from '@code-art-eg/angular-globalize';
import { NumberFormatterOptions } from 'globalize';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToNumberDirective),
  }],
  selector: '[frmToNumber]'
})
export class ToNumberDirective extends BaseConverterDirective<number> {

  @Input('frmToNumber') public digits: number | undefined = undefined;
  @Input() public frmNumberFormat: 'decimal' | 'percent' | NumberFormatterOptions | undefined = undefined;

  constructor(
    injector: Injector,
    typeConverter: TypeConverterService,
    cultureService: CurrentCultureService,
    protected readonly globalizationService: GlobalizationService,
  ) {
    super(injector, typeConverter, cultureService);
  }

  protected coerceValue(v: any): number | null | undefined {
    if (v === null || v === undefined) {
      return null;
    } else if (typeof v === 'string' && /^\s*$/.test(v)) {
      return null;
    }
    let val: number | null;
    if (this.frmNumberFormat) {
      if (typeof this.frmNumberFormat === 'string') {
        val = this.globalizationService.parseNumber(v, {
          style: this.frmNumberFormat,
        });
      } else {
        val =  this.globalizationService.parseNumber(v, this.frmNumberFormat);
      }
    } else {
      val = this.typeConverter.convertToNumber(v);
    }
    const valid = typeof val === 'number' && !isNaN(val) && val !== Infinity && val !== -Infinity;
    return valid ? val : undefined;
  }

  protected formatValue(v: number): string {
    if (this.frmNumberFormat) {
      if (typeof this.frmNumberFormat === 'string') {
        return this.globalizationService.formatNumber(v, {
          style: this.frmNumberFormat,
        });
      } else {
        return this.globalizationService.formatNumber(v, this.frmNumberFormat);
      }
    }
    if (typeof this.digits === 'number' && !isNaN(this.digits) && this.digits > 0) {
      return this.globalizationService.formatNumber(v, {
        maximumFractionDigits: this.digits,
        minimumFractionDigits: 0,
      });
    }
    return this.typeConverter.convertToString(v) as string;
  }

  protected valuesAreEqual(v1: number | null, v2: number | null): boolean {
    return v1 === v2;
  }
}
