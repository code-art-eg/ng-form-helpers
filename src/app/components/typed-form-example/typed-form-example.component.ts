import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductList, Product } from '../../models/test-models';
import { TypedFormGroup, TypedFormControl, TypedFormArray } from '@code-art-eg/ng-form-helpers';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art-eg/rx-helpers';
import { CommonValidators } from '../../../../projects/ng-form-helpers/src/lib';

const requiredIfField2 = (ctl: AbstractControl): ValidationErrors | null =>{
  const form = ctl.parent as TypedFormGroup<ProductList>;
  if (!form) {
    return null;
  }
  const v = ctl.value as string;
  if (v && v.trim().length > 0) {
    return null;
  }
  if (form.controls.field2.value) {
    return { required: true };
  }
  return null;
};

@TakeUntilDestroyed()
@Component({
  templateUrl: './typed-form-example.component.html',
  styleUrls: ['./typed-form-example.component.scss']
})
export class TypedFormExampleComponent implements OnInit, OnDestroy {
  public form: TypedFormGroup<ProductList>;
  constructor() {
    this.form = new TypedFormGroup<ProductList>({
      name: new TypedFormControl<string>(null, [Validators.required, Validators.maxLength(10)]),
      field1: new TypedFormControl<string>(null, [requiredIfField2]),
      field2: new TypedFormControl<string>(null),
      accept: new TypedFormControl<boolean>(false, [Validators.requiredTrue]),
      products: new TypedFormArray<Product>([], () => new TypedFormGroup<Product>({
        name: new TypedFormControl<string>(null, [Validators.required, Validators.maxLength(20)]),
        price: new TypedFormControl<number>(null, [Validators.required, CommonValidators.numeric]),
        quantity: new TypedFormControl<number>(null, [Validators.required, CommonValidators.integer]),
      })),
    });

    this.form.controls.field2.valueChanges
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => {
        this.form.controls.field1.markAsTouched();
        this.form.controls.field1.updateValueAndValidity();
      });
  }

  public get productFormArray(): TypedFormArray<Product> {
    return this.form.controls.products as TypedFormArray<Product>;
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }
}
