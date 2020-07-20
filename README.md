# @code-art-eg/ng-form-helpers

## About the library

This library contains directives and classes to help make creating forms easier with [Angular 9](https://angular.io).

## Consuming the library

### 1. Installing the library
The library depends on [@code-art-eg/angular-globalize](https://github.com/code-art-eg/angular-globalize) library. Please refer to that project page for information about how to setup this library as this information is not covered here.

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art-eg/ng-form-helper @code-art-eg/angular-globalize globalize cldr cldr-data --save
$ npm install @types/globalize @types/node --save-dev
```
or

```bash
$ yarn add @code-art-eg/ng-form-helper @code-art-eg/angular-globalize globalize cldr cldr-data
$ yarn add @types/globalize @types/node -D
```
### 2. Creating a form using the library

Modify your app module to import the `NgFormHelpersModule` 
```typescript
import { NgFormHelpersModule } from '@code-art-eg/ng-form-helpers';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularGlobalizeModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgFormHelpersModule.forRoot(),
    NgFormHelpersModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
```

Create interface for your form model
```typescript

export interface Product {
    name: string|null;
    price: number|null;
    quantity: number|null;
}

export interface ProductList {
    name: string|null;
    products: Product[];
}

```

Create form in your component
```typescript
@Component({
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public form: TypedFormGroup<ProductList>;
  constructor() {
    this.form = new TypedFormGroup<ProductList>({
      name: new TypedFormControl<string>(null),
      products: new TypedFormArray<Product>([], () => new TypedFormGroup<Product>({
        name: new TypedFormControl<string>(null),
        price: new TypedFormControl<number>(null),
        quantity: new TypedFormControl<number>(null),
      })),
    });
  }

  public get productFormArray(): TypedFormArray<Product> {
    return this.form.controls.products as TypedFormArray<Product>;
  }

  ngOnInit() {
  }
}

```

Change your template
```html
<form [formGroup]="form" class="form-horizontal">
    <div class="form-group" >
        <label>List Name</label>
        <div class="control-container">
            <input formControlName="name" frmToNull class="form-control"/>
        </div>
    </div>
    <div class="form-group">
        <label>Products</label>
        <div class="control-container">
            <div>
                <button class="btn" (click)="productFormArray.pushNewItem()">Add Product</button>
            </div>
            <div [formGroup]="productForm" *ngFor="let productForm of productFormArray.controls; let index = index" class="product-form">
                <div class="form-group">
                    <label>Product Name</label>
                    <div class="control-container">
                        <input formControlName="name" frmToNull class="form-control"/>
                    </div>
                </div>
                <div class="form-group">
                    <label>Product Price</label>
                    <div class="control-container">
                        <input formControlName="price" frmToNumber class="form-control"/>
                    </div>
                </div>
                <div class="form-group">
                    <label>Product Quantity</label>
                    <div class="control-container">
                        <input formControlName="quantity" frmToInteger class="form-control" />
                    </div>
                </div>
                <div class="button-container">
                    <button (click)="productFormArray.removeAt(index)">Remove</button>
                </div>
            </div>
        </div>
    </div>
</form>
<pre>{{ form.value | json }}</pre>
```

## TODO

The library needs better documentation, more samples and a demo site.

## License

MIT © Sherif Elmetainy \(Code Art\)
