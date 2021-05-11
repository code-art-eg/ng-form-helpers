import { TestBed } from '@angular/core/testing';
import { AngularGlobalizeModule } from '@code-art-eg/angular-globalize';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

const firstValueFrom = <T>(observable: Observable<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    observable.pipe(first()).subscribe((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });


import {
  DefaultTranslationService,
  NgFormHelpersModule,
  MessagesInjectionToken,
  DEFAULT_VALIDATION_MESSAGES,
  FormValidationContext,
  TranslationServiceInjectionToken,
  MessageCollection
} from '../../src/public_api';

describe('DefaultTranslationService', () => {
  let service: DefaultTranslationService;

  const customMessages: MessageCollection = {
    lang: 'en',
    messages: {
      email: '1',
      test: '2',
      bla: '3',
    },
    context: FormValidationContext,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgFormHelpersModule,
        NgFormHelpersModule.forRoot(),
        AngularGlobalizeModule.forRoot(['en-GB', 'de']),
      ],
      providers: [{
        provide: MessagesInjectionToken, useValue: customMessages, multi: true,
      }],
    });
    service = TestBed.inject<DefaultTranslationService>(DefaultTranslationService);
  });

  for (const key in DEFAULT_VALIDATION_MESSAGES.messages) {
    if (DEFAULT_VALIDATION_MESSAGES.messages.hasOwnProperty(key) && !customMessages.messages[key]) {
      it(`returns correct validation message for ${key} validator`, async () => {
        const res = await firstValueFrom(service.getMessageString(null, key, FormValidationContext));
        expect(res).toBe(DEFAULT_VALIDATION_MESSAGES.messages[key]);
      });
    }
  }

  for (const key in customMessages.messages) {
    if (customMessages.messages.hasOwnProperty(key)) {
      it(`returns custom validation message for ${key} validator`, async () => {
        const res = await firstValueFrom(service.getMessageString(null, key, FormValidationContext));
        expect(res).toBe(customMessages.messages[key]);
      });
    }
  }

  it('is provided via injection token', () => {
    expect(TestBed.inject(TranslationServiceInjectionToken)).toBe(service);
  });

  it('returns sentence case', async () => {
    expect(await firstValueFrom(service.getMessageString(null, 'firstName', 'form'))).toBe('First name');
    expect(await firstValueFrom(service.getMessageString(null, 'emailAddress', 'form'))).toBe('Email address');
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
