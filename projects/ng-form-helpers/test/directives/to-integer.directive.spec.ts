import { FormControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CANG_SUPPORTED_CULTURES, AngularGlobalizeModule, CurrentCultureService } from '@code-art/angular-globalize';

import { ToIntegerDirective } from '../../src/lib/directives/to-integer.directive';
import { GlobalizeDataEnGBModule } from 'src/app/globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataDeModule } from 'src/app/globalize-data/globalize-data-de.module';
import { GlobalizeDataArEGModule } from 'src/app/globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataModule } from 'src/app/globalize-data/globalize-data.module';

@Component({
  template: `
    <input type="text" frmToInteger [formControl]="formControl" />
  `
})
class TestComponent {
  public formControl: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control(1);
  }
}

describe('ToIntegerDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToIntegerDirective, TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularGlobalizeModule.forRoot(),
        AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']),
        GlobalizeDataEnGBModule,
        GlobalizeDataDeModule,
        GlobalizeDataArEGModule,
        GlobalizeDataModule,
      ],
    });

    fixture = TestBed.createComponent<TestComponent>(TestComponent);
    component = fixture.componentInstance;
  });

  it('updates model to null when input has empty string', async () => {
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(null);
  });

  it('updates model to value when input changes', async () => {
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '2';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(2);
  });

  it('updates input format when culture changes', async () => {
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '2,001';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(2001);

    cultureService.currentCulture = 'de-DE';
    expect(input.value).toBe('2.001');
    cultureService.currentCulture = 'ar-EG';
    expect(input.value).toBe('٢٬٠٠١');
    cultureService.currentCulture = 'en-GB';
    expect(input.value).toBe('2,001');
  });

  it('updates model with string values when input has invalid number', async () => {
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe('A');
    input.value = '٢٫١';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe('٢٫١');
    cultureService.currentCulture = 'ar-EG';
    expect(component.formControl.value).toBe('٢٫١');
  });

  it('updates disabled state', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    component.formControl.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
    component.formControl.enable();
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
  });

  it('raises touch events', async () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(component.formControl.touched).toBe(false);
    input.dispatchEvent(new Event('blur'));
    expect(component.formControl.touched).toBe(true);
  });
});

