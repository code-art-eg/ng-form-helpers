import { Component, Optional, Inject, Input, OnInit } from '@angular/core';
import {
  ValidationErrorCssClassToken,
  FormControlCssClassToken,
  FormControlValidCssClassToken,
  FormControlInvalidCssClassToken,
} from '../../css-constants';
import { MessageService } from '../../services';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dictionary } from '../../form-models';

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

  constructor(
    private readonly messageService: MessageService,
    @Optional() @Inject(ValidationErrorCssClassToken) validationErrorCssClass?: string,
    @Optional() @Inject(FormControlCssClassToken) formControlCssClass?: string,
    @Optional() @Inject(FormControlValidCssClassToken) formControlValidCssClass?: string,
    @Optional() @Inject(FormControlInvalidCssClassToken) formControlInvalidCssClass?: string,
    @Optional() private readonly _formGroup?: FormGroupDirective,
  ) {
    this.validationErrorCssClass = validationErrorCssClass;
    this.formControlCssClass = formControlCssClass;
    this.formControlValidCssClass = formControlValidCssClass;
    this.formControlInvalidCssClass = formControlInvalidCssClass;
  }

  @Input()
  public set control(val: AbstractControl | null) {
    this._control = val;
  }

  public get control(): AbstractControl | null {
    return this._control;
  }

  @Input()
  public set name(val: Array<string | number> | string) {
    if (!this._formGroup) {
      throw new Error(`Cannot set name property on ValidationErrorsComponent without a formGroup.
      Please use the frmControl property or use a component withing a container having [FormGroup] directive.`);
    }
    const control = this._formGroup.control.get(val);
    if (!control) {
      throw new Error(`Cannot set name property on ValidationErrorsComponent.
      The form group doesn't contain a control with path ${JSON.stringify(val)}.`);
    }
    this._control = control;
  }

  public get dummyControlClass(): Dictionary<boolean> {
    const res: Dictionary<boolean> = {};
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
    return this.control ? this.messageService.getControlErrors(this.control) : [];
  }

  public ngOnInit(): void {
    if (!this._control) {
      const error = `Control for ValidationErrorsComponent was not initialized.
       You can either set it by setting the control property
       or by including it in a container with [FormGroup] directive and setting the name property.`;
      throw (new Error(error));
    }
  }
}
