import { TestBed, ComponentFixture } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AngularGlobalizeModule, CurrentCultureService, GlobalizationService } from '@code-art-eg/angular-globalize';
import { By } from '@angular/platform-browser';
import { ToNumberDirective } from '../../src/lib/directives/to-number.directive';
import { GlobalizeDataEnGBModule } from 'src/app/globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataDeModule } from 'src/app/globalize-data/globalize-data-de.module';
import { GlobalizeDataArEGModule } from 'src/app/globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataModule } from 'src/app/globalize-data/globalize-data.module';

@Component({
  template: `
    <input type="text" frmToNumber [formControl]="formControl" />
  `
})
class TestComponent {
  public formControl: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control(1);
  }
}

@Component({
  template: `
  <input type="text" frmToNumber [frmNumberFormat]="{ useGrouping: false }" [formControl]="formControl" />
`
})
class TestFormatComponent {
  public formControl: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control(1);
  }
}

@Component({
  template: `
  <input type="text" frmToNumber frmNumberFormat="percent" [formControl]="formControl" />
`
})
class TestPercentComponent {
  public formControl: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control(0.25);
  }
}

@Component({
  template: `
  <input type="text" [frmToNumber]="10" [formControl]="formControl" />
`
})
class TestDigitsComponent {
  public formControl: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control(1);
  }
}

describe('ToNumberDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToNumberDirective, TestComponent, TestDigitsComponent, TestFormatComponent, TestPercentComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
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

  it('updates input format with more than default digits', async () => {
    fixture = TestBed.createComponent<TestDigitsComponent>(TestDigitsComponent);
    component = fixture.componentInstance;
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '2.144444444';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(2.144444444);

    cultureService.currentCulture = 'de-DE';
    expect(input.value).toBe('2,144444444');

    cultureService.currentCulture = 'en-GB';
    expect(input.value).toBe('2.144444444');
  });

  it('updates input format custom format', async () => {
    fixture = TestBed.createComponent<TestFormatComponent>(TestFormatComponent);
    component = fixture.componentInstance;
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '2144444444';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(2144444444);

    cultureService.currentCulture = 'de-DE';
    expect(input.value).toBe('2144444444');

    cultureService.currentCulture = 'en-GB';
    expect(input.value).toBe('2144444444');
  });

  it('updates input format percent', async () => {
    fixture = TestBed.createComponent<TestPercentComponent>(TestPercentComponent);
    component = fixture.componentInstance;
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(0.25);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('25%');
    input.value = '46%';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(0.46);

    cultureService.currentCulture = 'de-DE';
    expect(input.value).toBe(
      TestBed.inject<GlobalizationService>(GlobalizationService)
        .formatNumber(0.46, 'de-DE', { style: 'percent' })
    );

    cultureService.currentCulture = 'en-GB';
    expect(input.value).toBe('46%');
  });

  it('updates input format when culture changes', async () => {
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    cultureService.currentCulture = 'en-GB';
    expect(component.formControl.value).toBe(1);
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('1');
    input.value = '2.1';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(2.1);

    cultureService.currentCulture = 'de-DE';
    expect(input.value).toBe('2,1');
    cultureService.currentCulture = 'ar-EG';
    expect(input.value).toBe('٢٫١');
    cultureService.currentCulture = 'en-GB';
    expect(input.value).toBe('2.1');
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
    expect(component.formControl.value).toBe(2.1);
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
