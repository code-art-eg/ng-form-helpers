import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ToNullDirective } from '../../src/lib/directives/to-null.directive';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <input type="text" frmToNull [formControl]="formControl" />
  `
})
class TestComponent {
  public readonly formControl: FormControl;
  constructor(formBuilder: FormBuilder) {
    this.formControl = formBuilder.control('A');
  }
}

describe('ToNullDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToNullDirective, TestComponent],
      imports: [FormsModule, ReactiveFormsModule, AngularGlobalizeModule.forRoot()],
    });

    fixture = TestBed.createComponent<TestComponent>(TestComponent);
    component = fixture.componentInstance;
  });

  it('updates model to null when input has empty string', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('A');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe(null);
  });

  it('updates model value when input has a value', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('A');
    input.value = 'B';
    input.dispatchEvent(new Event('input'));
    expect(component.formControl.value).toBe('B');
  });

  it('updates input to empty string when model is null', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('A');
    component.formControl.setValue(null);
    expect(input.value).toBe('');
  });

  it('updates input value when model is not null', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    fixture.detectChanges();
    expect(input.value).toBe('A');
    component.formControl.setValue('B');
    expect(input.value).toBe('B');
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
