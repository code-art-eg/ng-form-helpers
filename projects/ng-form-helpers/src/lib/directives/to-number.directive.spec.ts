import { TestBed, ComponentFixture } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES, CurrentCultureService } from '@code-art/angular-globalize';
import { By } from '@angular/platform-browser';
import { ToNumberDirective } from './to-number.directive';
import { loadGlobalizeData } from '../../test/globalize-data-loader';

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

describe('ToNumberDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    beforeEach(() => {
        loadGlobalizeData();
        TestBed.configureTestingModule({
            declarations: [ToNumberDirective, TestComponent],
            imports: [FormsModule, ReactiveFormsModule, AngularGlobalizeModule.forRoot()],
            providers: [
                { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'ar', 'de'] }
            ]
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
        const cultureService = TestBed.get(CurrentCultureService) as CurrentCultureService;
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
        const cultureService = TestBed.get(CurrentCultureService) as CurrentCultureService;
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
