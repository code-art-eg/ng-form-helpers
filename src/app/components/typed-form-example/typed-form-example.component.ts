import { Component, OnInit } from '@angular/core';
import { ProductList, Product } from '../../models/test-models';
import { TypedFormGroup, TypedFormControl, TypedFormArray } from '@code-art/ng-form-helpers';
import { Validators } from '@angular/forms';

@Component({
  templateUrl: './typed-form-example.component.html',
  styleUrls: ['./typed-form-example.component.scss']
})
export class TypedFormExampleComponent implements OnInit {
  public form: TypedFormGroup<ProductList>;
  constructor() {
    this.form = new TypedFormGroup<ProductList>({
      name: new TypedFormControl<string>(null, [Validators.required, Validators.maxLength(10)]),
      products: new TypedFormArray<Product>([], () => new TypedFormGroup<Product>({
        name: new TypedFormControl<string>(null, [Validators.required, Validators.maxLength(20)]),
        price: new TypedFormControl<number>(null, [Validators.required]),
        quantity: new TypedFormControl<number>(null, [Validators.required, Validators.maxLength(20)]),
      })),
    });
  }

  public get productFormArray(): TypedFormArray<Product> {
    return this.form.controls.products as TypedFormArray<Product>;
  }

  ngOnInit() {
  }
}
