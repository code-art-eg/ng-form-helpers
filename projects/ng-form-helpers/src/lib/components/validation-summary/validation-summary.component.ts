import { Component, Optional, Inject, Input, AfterViewInit } from '@angular/core';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import {
  ValidationSummaryContainerCssClassToken,
  ValidationSummaryHeaderCssClassToken,
  ValidationSummaryErrorCssClassToken,
} from '../../css-constants';
import { Observable } from 'rxjs';
import { FormValidationContext } from '../../form-models';
import { MessageService } from '../../services/message.service';
import { TranslationKeyPrefixDirective } from '../../directives/translation-key-prefix.directive';

@Component({
  selector: 'frm-validation-summary',
  templateUrl: './validation-summary.component.html',
})
export class ValidationSummaryComponent implements AfterViewInit {
  @Input() public containerCssClass: string;
  @Input() public headingCssClass: string;
  @Input() public errorCssClass: string;
  public readonly header: Observable<string>;

  private _formGroup?: FormGroup;
  private _formGroupDirective?: FormGroupDirective;

  constructor(
    private readonly messageService: MessageService,
    @Optional() formGroupDirective?: FormGroupDirective,
    @Inject(ValidationSummaryContainerCssClassToken) @Optional() containerCssClass?: string,
    @Inject(ValidationSummaryHeaderCssClassToken) @Optional() headingCssClass?: string,
    @Inject(ValidationSummaryErrorCssClassToken) @Optional() errorCssClass?: string,
    @Optional() private readonly translationKeyPrefix?: TranslationKeyPrefixDirective,
  ) {
    this._formGroupDirective = formGroupDirective;
    this.containerCssClass = containerCssClass || '';
    this.headingCssClass = headingCssClass || '';
    this.errorCssClass = errorCssClass || '';
    this.header = messageService.getMessage({
      messageKey: 'validationSummary',
      context: FormValidationContext,
    });
  }

  @Input() public set form(val: FormGroup | undefined) {
    this._formGroup = val;
  }

  public get form(): FormGroup | undefined {
    return this._formGroup || this._formGroupDirective && this._formGroupDirective.form;
  }

  public get touched(): boolean {
    return !!(this.form && this.form.touched);
  }

  public get invalid(): boolean {
    return !!(this.form && this.form.invalid);
  }

  public get valid(): boolean {
    return !!(this.form && this.form.valid);
  }

  public get disabled(): boolean {
    return !!(this.form && this.form.disabled);
  }

  public get showError(): boolean {
    return this.invalid && this.touched && !this.disabled && this.errors.length > 0;
  }

  get errors(): Array<Observable<string>> {
    return this.form ? this.messageService.getAllControlErrors(this.form,
      this.translationKeyPrefix && this.translationKeyPrefix.frmTrnKeyPrefix) : [];
  }

  public ngAfterViewInit(): void {
    if (!this.form) {
      throw new Error(`ValidationSummaryComponent: form property it not initialized.
        It can be initialized by either setting a value to the [form] @Input for the component
        Or by including the container in a container having the [FormGroup] directive.
       `);
    }
  }
}
