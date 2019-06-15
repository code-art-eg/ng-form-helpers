import { TestBed } from '@angular/core/testing';
import { sentenceCase } from 'change-case';
import { first } from 'rxjs/operators';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES, CurrentCultureService, GlobalizationService } from '@code-art/angular-globalize';

import {
  NgFormHelpersModule,
  FormValidationContext,
  FormFieldContext,
  DEFAULT_VALIDATION_MESSAGES,
} from '../../src/public_api';
import { loadGlobalizeData } from '../globalize-data-loader';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { MessageService } from '../../src/lib/services/message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    loadGlobalizeData();
    TestBed.configureTestingModule({
      imports: [NgFormHelpersModule, AngularGlobalizeModule.forRoot()],
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'ar', 'de'] }
      ],
    });
    service = TestBed.get<MessageService>(MessageService);
  });

  function toString(p: any): string {
    return p !== null && p !== undefined ? p + '' : '';
  }

  function getMessage(key: string, p1: any, p2: any): string {
    const f = DEFAULT_VALIDATION_MESSAGES[key];
    return f.replace('{key}', toString(p1)).replace(`{${key}}`, toString(p2));
  }

  it('returns plain message', async () => {
    expect(await service.getMessage({
      messageKey: 'helloWorld',
    }).pipe(first()).toPromise()).toBe('Hello world');
  });

  it('returns plain message with context', async () => {
    expect(await service.getMessage({
      messageKey: 'email',
      context: FormValidationContext,
    }).pipe(first()).toPromise()).toBe(DEFAULT_VALIDATION_MESSAGES.email);
  });

  it('returns control errors', async () => {
    const ctl = new FormControl(10, [Validators.min(11), Validators.max(9)]);
    const group = new FormGroup({
      testNumber: ctl,
    });
    const res = service.getControlErrors(ctl);
    combineLatest(...res).pipe(first()).subscribe((s) => {
      expect(s.length).toBe(2);
      const m1 = getMessage('min', sentenceCase('testNumber'), 11);
      const m2 = getMessage('max', sentenceCase('testNumber'), 9);
      expect(s).toContain(m1);
      expect(s).toContain(m2);
    });
  });

  it('returns control with boolean errors', async () => {
    const ctl = new FormControl('aaaa', [Validators.email]);
    const group = new FormGroup({
      testEmail: ctl,
    });
    const res = service.getControlErrors(ctl);
    combineLatest(...res).pipe(first()).subscribe((s) => {
      expect(s.length).toBe(1);
      const m1 = getMessage('email', sentenceCase('testEmail'), undefined);
      expect(s).toContain(m1);
    });
  });

  it('returns formatted message with context', async () => {
    const key = 'min';
    const field = 'customerAge';
    const val = 1.1;
    const ob$ = service.getMessage({
      messageKey: key,
      context: FormValidationContext,
      parameters: {
        min: val,
        key: {
          messageKey: 'customerAge',
          context: FormFieldContext,
        },
      },
    });
    const cultureService = TestBed.get<CurrentCultureService>(CurrentCultureService);
    const globalizationService = TestBed.get<GlobalizationService>(GlobalizationService);
    cultureService.currentCulture = 'en-GB';
    let res: string | undefined;
    const sub = ob$.subscribe((v) => res = v);
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    cultureService.currentCulture = 'ar';
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    cultureService.currentCulture = 'de';
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    sub.unsubscribe();
  });
});
