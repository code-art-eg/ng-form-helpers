import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AngularGlobalizeModule } from '@code-art/angular-globalize';

import { CommonValidators, TranslationServiceInjectionToken, DefaultTranslationService, FormHelpers } from '../../src/lib';
import { ValidationSummaryComponent } from '../../src/lib/components/validation-summary/validation-summary.component';
import { GlobalizeDataModule } from 'src/app/globalize-data/globalize-data.module';
import { GlobalizeDataEnGBModule } from 'src/app/globalize-data/globalize-data-en-gb.module';

@Component({
  template: `
  <form [formGroup]="form">
    <input type="text" formControlName="name" />
    <frm-validation-summary></frm-validation-summary>
  </form>
`
})
class TestComponent implements AfterViewInit {
  public form: FormGroup;
  public name: FormControl;
  public initialized = false;
  @ViewChild(ValidationSummaryComponent) public validationSummary?: ValidationSummaryComponent;

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

describe('ValidationSummaryComponent', () => {

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationSummaryComponent, TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularGlobalizeModule.forRoot(['en-GB']),
        GlobalizeDataModule,
        GlobalizeDataEnGBModule,
      ],
      providers: [
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
    expect(component.validationSummary).toBeTruthy('Validation Errors not initalized');
  });

  it('does not show errors when invalid and not touched', async () => {
    component.name.setValue('');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationSummary && component.validationSummary.invalid).toBe(true);
    expect(component.validationSummary && component.validationSummary.valid).toBe(false);
    expect(component.validationSummary && component.validationSummary.touched).toBe(false);
    expect(component.validationSummary && component.validationSummary.showError).toBe(false);

    expect(component.validationSummary && component.validationSummary.errors.length).toBe(0);
  });

  it('shows errros when invalid and touched', async () => {
    component.name.setValue('1');
    FormHelpers.markAsTouchedRecursive(component.form);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationSummary && component.validationSummary.invalid).toBe(true);
    expect(component.validationSummary && component.validationSummary.valid).toBe(false);
    expect(component.validationSummary && component.validationSummary.touched).toBe(true);
    expect(component.validationSummary && component.validationSummary.showError).toBe(true);
    expect(component.validationSummary && component.validationSummary.errors.length).toBe(2);
  });

  it('does not show errors when valid', async () => {
    component.name.setValue('Test');
    FormHelpers.markAsTouchedRecursive(component.form);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.validationSummary && component.validationSummary.invalid).toBe(false);
    expect(component.validationSummary && component.validationSummary.valid).toBe(true);
    expect(component.validationSummary && component.validationSummary.touched).toBe(true);
    expect(component.validationSummary && component.validationSummary.showError).toBe(false);
    expect(component.validationSummary && component.validationSummary.errors.length).toBe(0);
  });
});
