import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AngularGlobalizeModule } from '@code-art-eg/angular-globalize';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { GlobalizeDataEnGBModule } from 'src/app/globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataModule } from 'src/app/globalize-data/globalize-data.module';
import {
  CommonValidators,
  DEFAULT_VALIDATION_MESSAGES,
  DefaultTranslationService,
  MessagesInjectionToken,
  TranslationServiceInjectionToken,
  TranslationKeyPrefixDirective,
  FormFieldContext
} from '../../src/lib';
import { ValidationErrorsComponent } from '../../src/lib/components/validation-errors/validation-errors.component';



const firstValueFrom = <T>(observable: Observable<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    observable.pipe(first()).subscribe((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });

@Component({
  template: `
  <form [formGroup]="form">
    <input type="text" formControlName="name" />
    <frm-validation-errors name="name"></frm-validation-errors>
    <div frmTrnKeyPrefix='tor'>
      <frm-validation-errors [control]="form.controls.ar.controls[0]"></frm-validation-errors>
    </div>
    <div frmTrnKeyPrefix='ror'>
      <frm-validation-errors [control]="formArray.controls[0]"></frm-validation-errors>
    </div>
  </form>
`
})
class TestComponent implements AfterViewInit {
  @ViewChildren(ValidationErrorsComponent) public all?: QueryList<ValidationErrorsComponent>;
  public form: FormGroup;
  public name: FormControl;
  public initialized = false;
  public formArray: FormArray;

  constructor(formBuilder: FormBuilder) {
    this.name = formBuilder.control(null, [
      Validators.required,
      CommonValidators.personName,
      Validators.maxLength(10),
      Validators.minLength(2),
    ]);
    this.form = formBuilder.group({
      name: this.name,
      ar: formBuilder.array([
        formBuilder.control('', Validators.required),
      ]),
    });
    this.formArray = formBuilder.array([
      formBuilder.control('', Validators.required),
    ]);
  }

  public ngAfterViewInit(): void {
    this.initialized = true;
  }

  public get validationErrors(): ValidationErrorsComponent | undefined {
    return this.all && this.all.get(0);
  }

  public get innerArrayValidationErrors(): ValidationErrorsComponent | undefined {
    return this.all && this.all.get(1);
  }

  public get arrayValidationErrors(): ValidationErrorsComponent | undefined {
    return this.all && this.all.get(2);
  }
}

describe('ValidationErrorsComponent', () => {

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidationErrorsComponent,
        TestComponent,
        TranslationKeyPrefixDirective,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularGlobalizeModule.forRoot(['en-GB']),
        GlobalizeDataEnGBModule,
        GlobalizeDataModule,
      ],
      providers: [
        { provide: MessagesInjectionToken, useValue: DEFAULT_VALIDATION_MESSAGES, multi: true },
        { provide: MessagesInjectionToken, useValue: {
          lang: 'en',
          messages: {
            'ror.0': 'First field',
            'tor.ar.0': 'Second field',
          },
          context: FormFieldContext,
        }, multi: true },
        { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService },
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('initializes properly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.initialized).toBe(true);
    expect(component.validationErrors).toBeTruthy('Validation Errors not initalized');
  });

  it('does not show errors when invalid and not touched', async () => {
    component.name.setValue('');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationErrors && component.validationErrors.invalid).toBe(true);
    expect(component.validationErrors && component.validationErrors.valid).toBe(false);
    expect(component.validationErrors && component.validationErrors.touched).toBe(false);
    expect(component.validationErrors && component.validationErrors.showError).toBe(false);
    expect(component.validationErrors && component.validationErrors.errors.length).toBe(1);
  });

  it('shows errros when invalid and not touched', async () => {
    component.name.setValue('1');
    component.name.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationErrors && component.validationErrors.invalid).toBe(true);
    expect(component.validationErrors && component.validationErrors.valid).toBe(false);
    expect(component.validationErrors && component.validationErrors.touched).toBe(true);
    expect(component.validationErrors && component.validationErrors.showError).toBe(true);
    expect(component.validationErrors && component.validationErrors.errors.length).toBe(2);
  });

  it('does not show errors when valid', async () => {
    component.name.setValue('Test');
    component.name.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationErrors && component.validationErrors.invalid).toBe(false);
    expect(component.validationErrors && component.validationErrors.valid).toBe(true);
    expect(component.validationErrors && component.validationErrors.touched).toBe(true);
    expect(component.validationErrors && component.validationErrors.showError).toBe(false);
    expect(component.validationErrors && component.validationErrors.errors.length).toBe(0);
  });

  it('shows valid control name in array', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.arrayValidationErrors && component.arrayValidationErrors.errors.length).toBe(1);
    expect(await firstValueFrom(component.arrayValidationErrors?.errors[0] as Observable<string>)).toBe('First field is required.');
  });

  it('shows valid control name in nested array', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.innerArrayValidationErrors && component.innerArrayValidationErrors.errors.length).toBe(1);
    expect(await firstValueFrom(component.innerArrayValidationErrors?.errors[0] as Observable<string>)).toBe('Second field is required.');
  });
});
