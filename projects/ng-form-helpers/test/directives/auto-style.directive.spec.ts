import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CommonValidators,
  ControlAutoStyleDirective,
  NgFormHelpersBootstrap4Module,
  TranslationServiceInjectionToken,
  DefaultTranslationService,
  TranslationKeyPrefixDirective,
} from '../../src/lib';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';

@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="firstName" frmControlAutoStyle #inputControl />
      <input type="text" formControlName="lastName" frmControlAutoStyle #prefixInputControl frmTrnKeyPrefix="customer" />
      <input type="checkbox" formControlName="accept" frmControlAutoStyle #inputCheck />
      <textarea formControlName="address" frmControlAutoStyle #areaControl></textarea>
      <select formControlName="country" frmControlAutoStyle #selectControl>
        <option value="eg">Egypt</option>
      </select>
    </form>
  `
})
class TestComponent {
  public readonly form: FormGroup;
  public readonly firstName: FormControl;
  public readonly lastName: FormControl;
  public readonly address: FormControl;
  public readonly country: FormControl;
  public readonly accept: FormControl;
  @ViewChild('inputControl', { static: false }) public inputControl?: ElementRef<HTMLInputElement>;
  @ViewChild('prefixInputControl', { static: false }) public prefixInputControl?: ElementRef<HTMLInputElement>;
  @ViewChild('inputCheck', { static: false }) public inputCheck?: ElementRef<HTMLInputElement>;
  @ViewChild('areaControl', { static: false }) public areaControl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('selectControl', { static: false }) public selectControl?: ElementRef<HTMLSelectElement>;

  constructor(formBuilder: FormBuilder) {
    this.accept = formBuilder.control(false, [Validators.requiredTrue]);
    this.country = formBuilder.control(null);
    this.address = formBuilder.control(null, [Validators.required]);
    this.firstName = formBuilder.control(null, [
      Validators.required,
      CommonValidators.personName,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]);
    this.lastName = formBuilder.control(null, [
      Validators.required,
      CommonValidators.personName,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]);
    this.form = formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      accept: this.accept,
      address: this.address,
      country: this.country,
    });
  }
}

describe('ControlAutoStyleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ControlAutoStyleDirective, TranslationKeyPrefixDirective],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgFormHelpersBootstrap4Module,
        AngularGlobalizeModule.forRoot(),
      ],
      providers: [
        { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inits correctly', () => {
    expect(component).toBeTruthy();
  });

  it('sets input text default class', () => {
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList.contains('form-control')).toBe(true);
  });

  it('sets input id', () => {
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.id).toBe('firstName');
  });

  it('sets invalid class', async () => {
    component.firstName.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList).toContain('is-invalid');
  });

  it('sets valid class', async () => {
    component.firstName.setValue('Bob');
    component.firstName.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList).toContain('is-valid');
  });

  it('sets input placeholder', () => {
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.placeholder).toBe('First name');
  });

  it('sets input aria-label', () => {
    const el = component.inputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.getAttribute('aria-label')).toBe('First name');
  });

  it('sets input prefixed placeholder', () => {
    const el = component.prefixInputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.placeholder).toBe('Customer last name');
  });

  it('sets input prefixed aria-label', () => {
    const el = component.prefixInputControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.getAttribute('aria-label')).toBe('Customer last name');
  });

  it('sets textarea placeholder', () => {
    const el = component.areaControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.placeholder).toBe('Address');
  });

  it('sets textarea aria-label', () => {
    const el = component.areaControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.getAttribute('aria-label')).toBe('Address');
  });

  it('sets textarea default class', () => {
    const el = component.areaControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList).toContain('form-control');
  });

  it('sets select default class', () => {
    const el = component.selectControl;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList).toContain('form-control');
  });

  it('sets checkbox default class', () => {
    const el = component.inputCheck;
    expect(el).toBeTruthy();
    if (!el) {
      return;
    }
    expect(el.nativeElement.classList).toContain('form-check-input');
  });
});
