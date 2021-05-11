import { TestBed } from '@angular/core/testing';
import { sentenceCase } from 'change-case';
import { first } from 'rxjs/operators';
import { AngularGlobalizeModule, CurrentCultureService, GlobalizationService } from '@code-art-eg/angular-globalize';

import {
  NgFormHelpersModule,
  FormValidationContext,
  FormFieldContext,
  DEFAULT_VALIDATION_MESSAGES,
} from '../../src/public_api';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { MessageService } from '../../src/lib/services/message.service';
import { GlobalizeDataEnGBModule } from 'src/app/globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataDeModule } from 'src/app/globalize-data/globalize-data-de.module';
import { GlobalizeDataArEGModule } from 'src/app/globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataModule } from 'src/app/globalize-data/globalize-data.module';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgFormHelpersModule, NgFormHelpersModule.forRoot(),
        AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']),
        GlobalizeDataEnGBModule,
        GlobalizeDataDeModule,
        GlobalizeDataArEGModule,
        GlobalizeDataModule,
      ],
    });
    service = TestBed.inject<MessageService>(MessageService);
  });

  const toString = (p: any): string => p !== null && p !== undefined ? p + '' : '';

  const getMessage = (key: string, p1: any, p2: any): string => {
    const f = DEFAULT_VALIDATION_MESSAGES.messages[key];
    return f.replace('{key}', toString(p1)).replace(`{${key}}`, toString(p2));
  };

  it('returns plain message', async () => {
    expect(await service.getMessage({
      messageKey: 'helloWorld',
    }).pipe(first()).toPromise()).toBe('Hello world');
  });

  it('returns plain message with context', async () => {
    expect(await service.getMessage({
      messageKey: 'email',
      context: FormValidationContext,
    }).pipe(first()).toPromise()).toBe(DEFAULT_VALIDATION_MESSAGES.messages.email);
  });

  it('returns control errors', async () => {
    const ctl = new FormControl(10, [Validators.min(11), Validators.max(9)]);
    const res = service.getControlErrors(ctl);
    combineLatest(res).pipe(first()).subscribe((s) => {
      expect(s.length).toBe(2);
      const m1 = getMessage('min', sentenceCase('field'), 11);
      const m2 = getMessage('max', sentenceCase('field'), 9);
      expect(s).toContain(m1);
      expect(s).toContain(m2);
    });
  });

  it('returns control with boolean errors', async () => {
    const ctl = new FormControl('aaaa', [Validators.email]);
    const res = service.getControlErrors(ctl);
    combineLatest(res).pipe(first()).subscribe((s) => {
      expect(s.length).toBe(1);
      const m1 = getMessage('email', sentenceCase('field'), undefined);
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
    const cultureService = TestBed.inject<CurrentCultureService>(CurrentCultureService);
    const globalizationService = TestBed.inject<GlobalizationService>(GlobalizationService);
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
