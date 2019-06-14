import { Directive, HostBinding, Optional, Inject, ElementRef, Input, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  FormControlCssClassToken,
  FormControlValidCssClassToken,
  FormControlInvalidCssClassToken,
  FormControlCheckCssClassToken,
} from '../css-constants';
import { FormHelpers } from '../form-helpers';
import { FormFieldContext } from '../form-models';
import { takeUntilDestroyed } from '@code-art/rx-helpers';
import { MessageService } from '../services/message.service';

@Directive({
  selector: '[frmControlAutoStyle]',
})
export class ControlAutoStyleDirective implements OnDestroy, OnInit, DoCheck {

  @Input() public cssClass?: string;
  @Input() public checkCssClass?: string;
  @Input() public validCssClass?: string;
  @Input() public invalidCssClass?: string;
  @Input() public showValidStatus = true;
  @Input() public setId = true;
  @Input() public setPlaceHolder = true;
  @Input() public setAriaLabel = true;

  private _label?: string;

  constructor(
    private readonly messageService: MessageService,
    private readonly ngControl: NgControl,
    private readonly hostElement: ElementRef,
    @Optional() @Inject(FormControlCssClassToken) formControlCssClass?: string,
    @Optional() @Inject(FormControlCheckCssClassToken) formControlCheckCssClass?: string,
    @Optional() @Inject(FormControlValidCssClassToken) formControlValidCssClass?: string,
    @Optional() @Inject(FormControlInvalidCssClassToken) formControlInvalidCssClass?: string,
  ) {
    this.cssClass = formControlCssClass;
    this.invalidCssClass = formControlInvalidCssClass;
    this.validCssClass = formControlValidCssClass;
    this.checkCssClass = formControlCheckCssClass;
  }

  @HostBinding('attr.aria-label') public get ariaLabel(): string | null {
    const el = this.htmlElement as HTMLInputElement|HTMLTextAreaElement;
    if (el.getAttribute('aria-label')) {
      return el.getAttribute('aria-label');
    }
    return this.setAriaLabel && this._label ? this._label : null;
  }

  @HostBinding('attr.placeholder') public get placeholder(): string | null {
    const el = this.htmlElement as HTMLInputElement|HTMLTextAreaElement;
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
      return null;
    }
    if (this.isCheckbox || this.isRadio) {
      return null;
    }
    if (el.placeholder) {
      return el.placeholder;
    }
    return this.setPlaceHolder && this._label ? this._label : null;
  }

  @HostBinding('attr.id') public get id(): string | null {
    if (this.htmlElement.id) {
      return this.htmlElement.id;
    }
    return this.setId && this.ngControl.control ? FormHelpers.computeControlId(this.ngControl.control) : null;
  }

  @HostBinding('class') public get classNames(): string | null {
    let list = '';
    if (this.isCheckbox || this.isRadio) {
      if (this.checkCssClass) {
        list += ' ' + this.checkCssClass;
      }
    } else {
      if (this.cssClass) {
        list += ' ' + this.cssClass;
      }
      if (this.valid && this.validCssClass && this.showValidStatus && this.touched) {
        list += ' ' + this.validCssClass;
      }
      if (this.invalid && this.invalidCssClass && this.touched) {
        list += ' ' + this.invalidCssClass;
      }
    }

    return list === '' ? null : list.trim();
  }

  public get key(): string | null | number {
    return this.ngControl.control ? FormHelpers.getControlKey(this.ngControl.control) : null;
  }

  public get isPassword(): boolean {
    return this.htmlElement && this.htmlElement.tagName === 'INPUT'
      && (this.htmlElement as HTMLInputElement).type === 'password';
  }

  public get isCheckbox(): boolean {
    return this.htmlElement && this.htmlElement.tagName === 'INPUT'
      && (this.htmlElement as HTMLInputElement).type === 'checkbox';
  }

  public get isRadio(): boolean {
    return this.htmlElement && this.htmlElement.tagName === 'INPUT'
      && (this.htmlElement as HTMLInputElement).type === 'radio';
  }

  public get htmlElement(): HTMLElement {
    return this.hostElement.nativeElement as HTMLElement;
  }

  public get touched(): boolean {
    return !!this.ngControl.touched;
  }

  public get valid(): boolean {
    return !!this.ngControl.valid;
  }

  public get invalid(): boolean {
    return !!this.ngControl.invalid;
  }

  public ngOnInit(): void {
    const key = this.key;
    if (typeof key === 'string') {
      this.messageService.getMessage({
        messageKey: key,
        context: FormFieldContext,
      })
      .pipe(takeUntilDestroyed(this))
      .subscribe((l) => this._label = l);
    }
  }

  public ngOnDestroy(): void {
  }

  public ngDoCheck(): void {
  }
}
