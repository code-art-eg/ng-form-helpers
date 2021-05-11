import { Component, Optional, Inject, Input } from '@angular/core';
import type { OnInit } from '@angular/core';
import {
  ValidationErrorCssClassToken,
  FormControlCssClassToken,
  FormControlValidCssClassToken,
  FormControlInvalidCssClassToken,
} from '../../css-constants';
import type { AbstractControl } from '@angular/forms';
import { FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { TranslationKeyPrefixDirective } from '../../directives/translation-key-prefix.directive';

@Component({
  selector: 'frm-validation-errors',
  templateUrl: './validation-errors.component.html',
})
export class ValidationErrorsComponent implements OnInit {

  @Input() public validationErrorCssClass?: string;
  @Input() public formControlCssClass?: string;
  @Input() public formControlValidCssClass?: string;
  @Input() public formControlInvalidCssClass?: string;

  private _control: AbstractControl | null = null;
  private _name: Array<string | number> | string | null = null;
  private _controlName: Array<string | number> | string | null = null;
  private _controlSet = false;

  constructor(
    private readonly messageService: MessageService,
    @Optional() @Inject(ValidationErrorCssClassToken) validationErrorCssClass?: string,
    @Optional() @Inject(FormControlCssClassToken) formControlCssClass?: string,
    @Optional() @Inject(FormControlValidCssClassToken) formControlValidCssClass?: string,
    @Optional() @Inject(FormControlInvalidCssClassToken) formControlInvalidCssClass?: string,
    @Optional() private readonly translationKeyPrefix?: TranslationKeyPrefixDirective,
    @Optional() private readonly _formGroup?: FormGroupDirective,
  ) {
    this.validationErrorCssClass = validationErrorCssClass || '';
    this.formControlCssClass = formControlCssClass;
    this.formControlValidCssClass = formControlValidCssClass;
    this.formControlInvalidCssClass = formControlInvalidCssClass;
  }

  @Input()
  public set control(val: AbstractControl | null) {
    this._control = val;
    this._controlName = null;
    this._name = null;
    this._controlSet = true;
  }

  public get control(): AbstractControl | null {
    if (!this._control || this._controlName !== this._name) {
      this._controlName = this._name;
      if (!this._controlSet && this._name) {
        if (this._formGroup) {
          this._control = this._formGroup.control.get(this._name);
        } else {
          this._control = null;
        }
      } else {
        this._control = null;
      }
    }
    return this._control;
  }

  @Input()
  public set name(val: Array<string | number> | string) {
    if (!this._formGroup) {
      throw new Error(`Cannot set name property on ValidationErrorsComponent without a formGroup.
      Please use the frmControl property or use a component withing a container having [FormGroup] directive.`);
    }
    this._name = val;
    this._control = null;
    this._controlSet = false;
  }

  public get dummyControlClass(): Record<string, boolean> {
    const res: Record<string, boolean> = {};
    if (this.formControlCssClass) {
      res[this.formControlCssClass] = true;
    }
    if (this.formControlInvalidCssClass) {
      res[this.formControlInvalidCssClass] = this.invalid;
    }
    if (this.formControlValidCssClass) {
      res[this.formControlValidCssClass] = this.valid;
    }
    return res;
  }

  public get touched(): boolean {
    return !!(this.control && this.control.touched);
  }

  public get invalid(): boolean {
    return !!(this.control && this.control.invalid);
  }

  public get valid(): boolean {
    return !!(this.control && this.control.valid);
  }

  public get disabled(): boolean {
    return !!(this.control && this.control.disabled);
  }

  public get showError(): boolean {
    return this.invalid && this.touched && !this.disabled;
  }

  public get errors(): Array<Observable<string>> {
    return this.control ? this.messageService.getControlErrors(this.control,
      this.translationKeyPrefix && this.translationKeyPrefix.frmTrnKeyPrefix
    ) : [];
  }

  public ngOnInit(): void {
    if (!this.control) {
      const error = `Control for ValidationErrorsComponent was not initialized.
       You can either set it by setting the control property
       or by including it in a container with [FormGroup] directive and setting the name property.`;
      throw (new Error(error));
    }
  }
}
