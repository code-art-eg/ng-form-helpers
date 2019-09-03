import { OnDestroy, OnInit, Injector, Injectable } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, BehaviorSubject } from 'rxjs';

import { takeUntilDestroyed } from '@code-art/rx-helpers';
import { CurrentCultureService, TypeConverterService } from '@code-art/angular-globalize';

@Injectable()
export abstract class BaseConverterDirective<T>
  implements OnDestroy, OnInit, ControlValueAccessor {

  private _controlValueAccessor: ControlValueAccessor | undefined;
  private readonly _onchange: Array<(val: any) => void> = [];
  private readonly _ontouch: Array<() => void> = [];
  private _controlValue: any = undefined;
  private _disabled = false;
  private _valueSubject: BehaviorSubject<T | null | string> = new BehaviorSubject<T | null | string>(null);

  constructor(
    protected readonly injector: Injector,
    protected readonly typeConverter: TypeConverterService,
    private readonly cultureService: CurrentCultureService,
  ) {
  }

  public writeValue(val: any): void {
    this.value = val;
  }

  get value(): T | null | string {
    return this._valueSubject.value;
  }

  set value(val: T | null | string) {
    if (typeof val === 'string') {
      if (val === this._valueSubject.value) {
        return;
      }
    } else if (typeof this._valueSubject.value !== 'string' && this.valuesAreEqual(val, this._valueSubject.value)) {
      return;
    }
    this._valueSubject.next(val);
    this.raiseOnChange(val);
  }

  public ngOnDestroy(): void {
    this.setAccessor(undefined);
    this._valueSubject.complete();
  }

  public registerOnChange(fn: any): void {
    if (typeof fn === 'function') {
      this._onchange.push(fn);
    }
  }

  public registerOnTouched(fn: any): void {
    if (typeof fn === 'function') {
      this._ontouch.push(fn);
    }
  }

  public setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (this._controlValueAccessor) {
      if (typeof this._controlValueAccessor.setDisabledState === 'function') {
        this._controlValueAccessor.setDisabledState(this._disabled);
      }
    }
  }

  public ngOnInit(): void {
    this.selectAccessor();
  }

  protected abstract coerceValue(v: any): T | null | undefined;

  protected abstract formatValue(v: T): string;

  protected abstract valuesAreEqual(v1: T | null, v2: T | null): boolean;

  private raiseOnChange(val: any): void {
    for (const fn of this._onchange) {
      fn(val);
    }
  }

  private raiseOnTouched(): void {
    for (const fn of this._ontouch) {
      fn();
    }
  }

  private setAccessor(accessor: ControlValueAccessor | undefined): void {
    if (this._controlValueAccessor === accessor) {
      return;
    }
    this._controlValueAccessor = accessor;
    if (accessor) {
      accessor.registerOnChange((v: any) => {
        if (this._controlValueAccessor !== accessor) {
          return;
        }
        this._controlValue = v;
        const val = this.coerceValue(v);
        this.value = val !== undefined ? val : v;
      });
      accessor.registerOnTouched(() => {
        if (this._controlValueAccessor !== accessor) {
          return;
        }
        this.raiseOnTouched();
      });
      if (typeof accessor.setDisabledState === 'function') {
        accessor.setDisabledState(this._disabled);
      }
    }
  }

  private selectAccessor(): void {
    let accessors = this.injector.get<ControlValueAccessor | ControlValueAccessor[]>(NG_VALUE_ACCESSOR);
    if (accessors) {
      accessors = Array.isArray(accessors) ? accessors : [accessors];
      for (const accessor of accessors) {
        if (accessor !== this) {
          if (this._controlValueAccessor) {
            throw new Error(`More than one control value accessor is provider.`);
          }
          this.setAccessor(accessor);
        }
      }
    }

    combineLatest([this.cultureService.cultureObservable, this._valueSubject])
      .pipe(takeUntilDestroyed(this))
      .subscribe((v) => {
        if (!this._controlValueAccessor) {
          return;
        }
        const [, val] = v;
        let coercedValue: T | undefined | null;
        if (typeof val === 'string') {
          coercedValue = this.coerceValue(val);
          if (coercedValue !== undefined && coercedValue !== val) {
            this.value = coercedValue;
          } else if (this._controlValue !== val) {
            this._controlValue = val;
            this._controlValueAccessor.writeValue(val);
          }
        } else if (val === null) {
          if (this._controlValue !== '') {
            this._controlValue = '';
            this._controlValueAccessor.writeValue('');
          }
        } else {
          coercedValue = this.coerceValue(this._controlValue);
          if (coercedValue === undefined || !this.valuesAreEqual(coercedValue, val)) {
            this._controlValue = this.formatValue(val);
            this._controlValueAccessor.writeValue(this._controlValue);
          }
        }
      });
  }
}
