import { Directive, Optional, Inject, ElementRef, Input, Renderer2 } from '@angular/core';
import type { OnDestroy, OnInit, DoCheck } from '@angular/core';

import { NgControl } from '@angular/forms';
import {
  FormControlCssClassToken,
  FormControlValidCssClassToken,
  FormControlInvalidCssClassToken,
  FormControlCheckCssClassToken,
} from '../css-constants';
import { FormHelpers } from '../form-helpers';
import { FormFieldContext } from '../form-models';
import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art/rx-helpers';
import { MessageService } from '../services/message.service';
import { TranslationKeyPrefixDirective } from './translation-key-prefix.directive';

@TakeUntilDestroyed()
@Directive({
  selector: '[frmControlAutoStyle]',
})
export class ControlAutoStyleDirective implements OnDestroy, OnInit, DoCheck {

  private _cssClass?: string | undefined;
  private _checkCssClass?: string | undefined;
  private _validCssClass?: string | undefined;
  private _invalidCssClass?: string;

  @Input() public showValidStatus = true;
  @Input() public setId = true;
  @Input() public setPlaceHolder = true;
  @Input() public setAriaLabel = true;

  private _ariaLabelSet = false;
  private _idSet = false;
  private _placeHolderSet = false;

  private _label?: string;
  private readonly _isIE: boolean;
  constructor(
    private readonly messageService: MessageService,
    private readonly ngControl: NgControl,
    private readonly hostElement: ElementRef,
    private readonly renderer2: Renderer2,
    @Optional() private readonly translationKeyPrefix?: TranslationKeyPrefixDirective,
    @Optional() @Inject(FormControlCssClassToken) formControlCssClass?: string,
    @Optional() @Inject(FormControlCheckCssClassToken) formControlCheckCssClass?: string,
    @Optional() @Inject(FormControlValidCssClassToken) formControlValidCssClass?: string,
    @Optional() @Inject(FormControlInvalidCssClassToken) formControlInvalidCssClass?: string,
  ) {
    const d = document as any;
    const w = window as any;
    this._isIE = !!w.MSInputMethodContext && !!(d.documentMode);
    this.cssClass = formControlCssClass;
    this.invalidCssClass = formControlInvalidCssClass;
    this.validCssClass = formControlValidCssClass;
    this.checkCssClass = formControlCheckCssClass;
  }

  public get checkCssClass(): string | undefined {
    return this._checkCssClass;
  }

  @Input() public set checkCssClass(value: string | undefined) {
    if (this._isIE) {
      return;
    }
    if (this._checkCssClass && value !== this._checkCssClass && this.hostElement && this.hostElement.nativeElement) {
      this.renderer2.removeClass(this.hostElement.nativeElement, this._checkCssClass);
    }
    this._checkCssClass = value;
  }

  public get cssClass(): string | undefined {
    return this._cssClass;
  }

  @Input() public set cssClass(value: string | undefined) {
    if (this._isIE) {
      return;
    }
    if (this._cssClass && value !== this._cssClass && this.hostElement && this.hostElement.nativeElement) {
      this.renderer2.removeClass(this.hostElement.nativeElement, this._cssClass);
    }
    this._cssClass = value;
  }

  public get validCssClass(): string | undefined {
    return this._validCssClass;
  }

  @Input() public set validCssClass(value: string | undefined) {
    if (this._isIE) {
      return;
    }
    if (this._validCssClass && value !== this._validCssClass && this.hostElement && this.hostElement.nativeElement) {
      this.renderer2.removeClass(this.hostElement.nativeElement, this._validCssClass);
    }
    this._validCssClass = value;
  }

  public get invalidCssClass(): string | undefined {
    return this._invalidCssClass;
  }

  @Input() public set invalidCssClass(value: string | undefined) {
    if (this._isIE) {
      return;
    }
    if (this._invalidCssClass && value !== this._invalidCssClass && this.hostElement && this.hostElement.nativeElement) {
      this.renderer2.removeClass(this.hostElement.nativeElement, this._invalidCssClass);
    }
    this._invalidCssClass = value;
  }

  public get key(): string | null | number {
    if (!this.ngControl.control) {
      return null;
    }
    const key = FormHelpers.getControlKey(this.ngControl.control);
    if (this.translationKeyPrefix && this.translationKeyPrefix.frmTrnKeyPrefix) {
      return `${this.translationKeyPrefix.frmTrnKeyPrefix}.${key}`;
    }
    return key;
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
    if (this._isIE) {
      return;
    }
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
    if (this._isIE) {
      return;
    }
    if (!this.hostElement || !this.hostElement.nativeElement) {
      return;
    }
    const el = this.htmlElement as HTMLInputElement | HTMLTextAreaElement;
    const isInputOrTextArea = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    const isRadioOrCheck = isInputOrTextArea && this.isCheckbox || this.isRadio;
    this._idSet = this.setAttrInternal(this.setId, this._idSet, 'id',
      !this.ngControl || !this.ngControl.control, () => FormHelpers.computeControlId(this.ngControl.control));
    this._placeHolderSet = this.setAttrInternal(this.setPlaceHolder, this._placeHolderSet, 'placeholder',
      !isInputOrTextArea || isRadioOrCheck, () => this._label);
    this._ariaLabelSet = this.setAttrInternal(this.setAriaLabel, this._ariaLabelSet, 'aria-label',
      !isInputOrTextArea, () => this._label);
    this.setClass(this.checkCssClass, isRadioOrCheck);
    this.setClass(this.cssClass, !isRadioOrCheck);
    this.setClass(this.validCssClass, this.valid && this.showValidStatus && this.touched);
    this.setClass(this.invalidCssClass, this.invalid && this.touched);
  }

  private setClass(clsName: string|null|undefined, condition: boolean): void {
    if (!clsName) {
      return;
    }
    if (condition) {
      this.renderer2.addClass(this.hostElement.nativeElement, clsName);
    } else {
      this.renderer2.removeClass(this.hostElement.nativeElement, clsName);
    }
  }

  private setAttrInternal(
    shouldSet: boolean,
    isSet: boolean,
    attrName: string,
    ignore: boolean,
    computeAttr: () => string | undefined | null,
  ): boolean {
    if (ignore) {
      return isSet;
    }
    if (!shouldSet) {
      if (isSet) {
        this.renderer2.removeAttribute(this.hostElement.nativeElement, attrName);
      }
      return false;
    } else {
      if (!isSet) {
        if (this.hostElement.nativeElement[attrName]) {
          return false;
        }
      }
      const val = computeAttr();
      if (val) {
        this.renderer2.setAttribute(this.hostElement.nativeElement, attrName, val);
      } else {
        this.renderer2.removeAttribute(this.hostElement.nativeElement, attrName);
      }
      return true;
    }
  }
}
