import { TestBed } from '@angular/core/testing';

import {
  DefaultTranslationService,
  StringDictionary,
  NgFormHelpersModule,
  ValidationMessagesInjectionToken,
  DEFAULT_VALIDATION_MESSAGES,
  FormValidationContext,
  TranslationServiceInjectionToken
} from '../../src/public_api';

describe('DefaultTranslationService', () => {
  let service: DefaultTranslationService;

  const customMessages: StringDictionary = {
    'email': '1',
    'test': '2',
    'bla': '3',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgFormHelpersModule,
        NgFormHelpersModule.forRoot(),
      ],
      providers: [{
        provide: ValidationMessagesInjectionToken, useValue: customMessages, multi: true,
      }],
    });
    service = TestBed.get<DefaultTranslationService>(DefaultTranslationService);
  });

  for (const key in DEFAULT_VALIDATION_MESSAGES) {
    if (DEFAULT_VALIDATION_MESSAGES.hasOwnProperty(key) && !customMessages[key]) {
      it(`returns correct validation message for ${key} validator`, async () => {
        const res = await service.getMessageString(null, key, FormValidationContext).toPromise();
        expect(res).toBe(DEFAULT_VALIDATION_MESSAGES[key]);
      });
    }
  }

  for (const key in customMessages) {
    if (customMessages.hasOwnProperty(key)) {
      it(`returns custom validation message for ${key} validator`, async () => {
        const res = await service.getMessageString(null, key, FormValidationContext).toPromise();
        expect(res).toBe(customMessages[key]);
      });
    }
  }

  it('is provided via injection token', () => {
    expect(TestBed.get(TranslationServiceInjectionToken)).toBe(service);
  });

  it('returns sentence case', async () => {
    expect(await service.getMessageString(null, 'firstName', 'form').toPromise()).toBe('First name');
    expect(await service.getMessageString(null, 'emailAddress', 'form').toPromise()).toBe('Email address');
  });

  it('returns the same object with multiple calls', () => {
    expect(service.getMessageString(null, 'firstName', 'form'))
      .toBe(service.getMessageString(null, 'firstName', 'form'));
    expect(service.getMessageString(null, 'emailAddress', 'form'))
      .toBe(service.getMessageString(null, 'emailAddress', 'form'));
    expect(service.getMessageString(null, 'email', FormValidationContext))
      .toBe(service.getMessageString(null, 'email', FormValidationContext));
  });
});
