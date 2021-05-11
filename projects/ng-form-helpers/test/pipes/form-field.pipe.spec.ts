import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
  } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularGlobalizeModule, CurrentCultureService } from '@code-art-eg/angular-globalize';
import {
  DefaultTranslationService,
  FormFieldContext,
  MessageCollection,
  MessagesInjectionToken,
  TranslationServiceInjectionToken
  } from '../../src/lib';
import { FormFieldPipe } from '../../src/lib/pipes/form-field.pipe';

@Component({
  template: `
  <span #testSpan>{{ 'test' | frmField }}</span>
  <span #testSpanEn>{{ 'test' | frmField:'en' }}</span>
  <span #testSpanDe>{{ 'test' | frmField:'de' }}</span>
`
})
class TestComponent implements AfterViewInit {
  @ViewChild('testSpan') public testSpan?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanEn') public testSpanEn?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanDe') public testSpanDe?: ElementRef<HTMLSpanElement>;
  public initialized = false;

  constructor() {

  }

  public ngAfterViewInit(): void {
    this.initialized = true;
  }
}

describe('FormFieldPipe', () => {

  const enMessages: MessageCollection = {
    lang: 'en',
    messages: {
      test: 'Test English'
    },
    context: FormFieldContext,
  };

  const deMessages: MessageCollection = {
    lang: 'de',
    messages: {
      test: 'Test German'
    },
    context: FormFieldContext,
  };

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldPipe, TestComponent],
      imports: [
        AngularGlobalizeModule.forRoot(['en-GB', 'de']),
      ],
      providers: [
        { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService },
        { provide: MessagesInjectionToken, multi: true, useValue: enMessages },
        { provide: MessagesInjectionToken, multi: true, useValue: deMessages },
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('Translates messages', async () => {
    const cultureService = TestBed.inject(CurrentCultureService);
    cultureService.currentCulture = 'en';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.testSpan?.nativeElement?.innerText).toBe(enMessages.messages.test);
    expect(component.testSpanEn?.nativeElement?.innerText).toBe(enMessages.messages.test);
    expect(component.testSpanDe?.nativeElement?.innerText).toBe(deMessages.messages.test);

    cultureService.currentCulture = 'de';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.testSpan?.nativeElement?.innerText).toBe(deMessages.messages.test);
    expect(component.testSpanEn?.nativeElement?.innerText).toBe(enMessages.messages.test);
    expect(component.testSpanDe?.nativeElement?.innerText).toBe(deMessages.messages.test);
  });

});
