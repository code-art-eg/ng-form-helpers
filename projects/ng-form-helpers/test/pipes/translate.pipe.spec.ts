import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularGlobalizeModule, CurrentCultureService } from '@code-art-eg/angular-globalize';
import { DefaultTranslationService, MessageCollection, MessagesInjectionToken, TranslationServiceInjectionToken } from '../../src/lib';
import { TranslatePipe } from '../../src/lib/pipes/translate.pipe';

@Component({
  template: `
  <span #testSpan>{{ 'test' | frmTranslate }}</span>
  <span #testSpanCtx>{{ 'test' | frmTranslate:'CTX' }}</span>
  <span #testSpanEn>{{ 'test' | frmTranslate:'':'en' }}</span>
  <span #testSpanDe>{{ 'test' | frmTranslate:'':'de' }}</span>
  <span #testSpanEnCtx>{{ 'test' | frmTranslate:'CTX':'en' }}</span>
  <span #testSpanDeCtx>{{ 'test' | frmTranslate:'CTX':'de' }}</span>
`
})
class TestComponent implements AfterViewInit {
  @ViewChild('testSpan') public testSpan?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanCtx') public testSpanCtx?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanEn') public testSpanEn?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanDe') public testSpanDe?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanEnCtx') public testSpanEnCtx?: ElementRef<HTMLSpanElement>;
  @ViewChild('testSpanDeCtx') public testSpanDeCtx?: ElementRef<HTMLSpanElement>;
  public initialized = false;

  constructor() {

  }

  public ngAfterViewInit(): void {
    this.initialized = true;
  }
}

describe('TranslatePipe', () => {

  const enMessages: MessageCollection = {
    lang: 'en',
    messages: {
      test: 'Test English'
    },
  };

  const enContextMessages: MessageCollection = {
    lang: 'en',
    messages: {
      test: 'Test English Context',
    },
    context: 'CTX',
  };

  const deMessages: MessageCollection = {
    lang: 'de',
    messages: {
      test: 'Test German'
    },
  };

  const deContextMessages: MessageCollection = {
    lang: 'de',
    messages: {
      test: 'Test German Context',
    },
    context: 'CTX'
  };

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslatePipe, TestComponent],
      imports: [
        AngularGlobalizeModule.forRoot(['en-GB', 'de']),
      ],
      providers: [
        { provide: TranslationServiceInjectionToken, useExisting: DefaultTranslationService },
        { provide: MessagesInjectionToken, multi: true, useValue: enMessages },
        { provide: MessagesInjectionToken, multi: true, useValue: enContextMessages },
        { provide: MessagesInjectionToken, multi: true, useValue: deMessages },
        { provide: MessagesInjectionToken, multi: true, useValue: deContextMessages },
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
    expect(component.testSpanCtx?.nativeElement?.innerText).toBe(enContextMessages.messages.test);
    expect(component.testSpanEn?.nativeElement?.innerText).toBe(enMessages.messages.test);
    expect(component.testSpanEnCtx?.nativeElement?.innerText).toBe(enContextMessages.messages.test);
    expect(component.testSpanDe?.nativeElement?.innerText).toBe(deMessages.messages.test);
    expect(component.testSpanDeCtx?.nativeElement?.innerText).toBe(deContextMessages.messages.test);

    cultureService.currentCulture = 'de';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.testSpan?.nativeElement?.innerText).toBe(deMessages.messages.test);
    expect(component.testSpanCtx?.nativeElement?.innerText).toBe(deContextMessages.messages.test);
    expect(component.testSpanEn?.nativeElement?.innerText).toBe(enMessages.messages.test);
    expect(component.testSpanEnCtx?.nativeElement?.innerText).toBe(enContextMessages.messages.test);
    expect(component.testSpanDe?.nativeElement?.innerText).toBe(deMessages.messages.test);
    expect(component.testSpanDeCtx?.nativeElement?.innerText).toBe(deContextMessages.messages.test);

  });

});
