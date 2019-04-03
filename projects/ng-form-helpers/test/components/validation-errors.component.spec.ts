import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild, ComponentRef, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CANG_SUPPORTED_CULTURES, AngularGlobalizeModule } from '@code-art/angular-globalize';
import { loadGlobalizeData } from '../globalize-data-loader';

import { ValidationErrorsComponent } from '../../src/lib/components';
import { CommonValidators, TranslationServiceInjectionToken, DefaultTranslationService } from '../../src/lib';

@Component({
  template: `
  <form [formGroup]="form">
    <input type="text" formControlName="name" />
    <frm-validation-errors name="name"></frm-validation-errors>
  </form>
`
})
class TestComponent implements AfterViewInit {
  public form: FormGroup;
  public name: FormControl;
  public initialized = false;
  @ViewChild(ValidationErrorsComponent) public validationErrors?: ValidationErrorsComponent;

  constructor(formBuilder: FormBuilder) {
    this.name = formBuilder.control(null, [
      Validators.required,
      CommonValidators.personName,
      Validators.maxLength(10),
      Validators.minLength(2),
    ]);
    this.form = formBuilder.group({
      name: this.name,
    });
  }

  public ngAfterViewInit(): void {
    this.initialized = true;
  }
}

describe('ValidationErrorsComponent', () => {

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    loadGlobalizeData();
    TestBed.configureTestingModule({
      declarations: [ValidationErrorsComponent, TestComponent],
      imports: [FormsModule, ReactiveFormsModule, AngularGlobalizeModule.forRoot()],
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB'] },
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
});
